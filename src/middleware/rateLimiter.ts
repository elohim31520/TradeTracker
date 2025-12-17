import { RateLimiterRedis, RateLimiterMemory, IRateLimiterOptions } from 'rate-limiter-flexible';
import express, { Request, Response, NextFunction } from 'express';
// 建議為 errorCodes 和 redis 補上 .d.ts 定義，這裡暫時保留 ignore
//@ts-ignore
import errorCodes from '../constant/errorCodes';
//@ts-ignore
import { fail } from '../modules/responseHelper';
//@ts-ignore
import redisClient from '../modules/redis';
//@ts-ignore
import logger from '../logger';

// --- 參數設定 ---
// 建議：拉長窗口時間，對於防範持續性爬蟲較有效
const LIMIT_POINTS = process.env.RATE_LIMIT_POINTS ? Number(process.env.RATE_LIMIT_POINTS) : 100; // 每分鐘 100 次
const LIMIT_DURATION = process.env.RATE_LIMIT_DURATION ? Number(process.env.RATE_LIMIT_DURATION) : 60; // 60 秒
const KEY_PREFIX = 'rl:'; // 縮短 prefix 節省 Redis 記憶體

// const isDevelopment = process.env.NODE_ENV === 'development';
const isDevelopment = false

let rateLimiter: RateLimiterRedis | RateLimiterMemory | null = null;

// 初始化工廠函數
const createLimiter = (): RateLimiterRedis | RateLimiterMemory => {
    // 檢查 Redis 是否連線 (兼容 node-redis v4 的 isOpen 或 v3 的 connected)
    const isRedisReady = redisClient && (redisClient.isOpen || redisClient.connected || redisClient.isReady);

    if (isRedisReady) {
        logger.info(`[RateLimiter] 使用 Redis 模式 (Limit: ${LIMIT_POINTS}/${LIMIT_DURATION}s)`);
        return new RateLimiterRedis({
            storeClient: redisClient,
            keyPrefix: KEY_PREFIX,
            points: LIMIT_POINTS,
            duration: LIMIT_DURATION,
            // 如果 Redis 斷線，自動使用記憶體保險絲 (insuranceLimiter)
            insuranceLimiter: new RateLimiterMemory({
                points: LIMIT_POINTS,
                duration: LIMIT_DURATION,
            }),
        });
    } else {
        logger.warn(`[RateLimiter] Redis 未就緒，降級為記憶體模式`);
        return new RateLimiterMemory({
            points: LIMIT_POINTS,
            duration: LIMIT_DURATION,
        });
    }
};

// 導出初始化，在 Server 啟動時呼叫
export const initRateLimiter = async () => {
    try {
        rateLimiter = createLimiter();
    } catch (error) {
        logger.error('[RateLimiter] 初始化失敗:', error);
        // 最後一道防線
        rateLimiter = new RateLimiterMemory({ points: LIMIT_POINTS, duration: LIMIT_DURATION });
    }
};

const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 排除路徑
    if (req.path.startsWith('/public') || req.path === '/health') {
        return next();
    }

    // 確保限流器已初始化 (防止啟動時的 Race condition)
    if (!rateLimiter) {
        await initRateLimiter();
    }

    // 1. IP 處理: 請確保 app.set('trust proxy', 1) 已在 app.ts 中設定
    // 這樣 req.ip 就會是真實 IP (包含 CF-Connecting-IP 的處理)
    const clientIp = req.ip || '0.0.0.0';

    // 本地請求白名單
    // if (clientIp === '::1' || clientIp === '127.0.0.1') {
    //     return next();
    // }

    // 2. Key 生成: 移除 User-Agent，防止透過切換 UA 繞過限流
    // 如果是登入接口，建議加入 req.body.username 作為 Key
    const rateLimitKey = clientIp; 

    // 開發環境增加額度，而不是完全跳過 (方便測試邏輯)
    const pointsToConsume = isDevelopment ? 0 : 1; 

    try {
        const result = await rateLimiter!.consume(rateLimitKey, pointsToConsume);
        
        // 可選：在 Header 告訴前端剩餘次數 (標準做法)
        res.set('X-RateLimit-Remaining', String(result.remainingPoints));
        res.set('X-RateLimit-Reset', String(new Date(Date.now() + result.msBeforeNext).toISOString()));
        
        next();
    } catch (rejRes: any) {
        // rejRes 來自 rate-limiter-flexible，包含 msBeforeNext 等資訊
        const msBeforeNext = rejRes.msBeforeNext || 1000;
        const retrySeconds = Math.ceil(msBeforeNext / 1000);

        logger.warn(`[RateLimit] IP 被限制: ${clientIp}`, {
            key: rateLimitKey,
            path: req.path,
            ua: req.headers['user-agent']
        });

        res.status(429).json(
            fail(
                errorCodes.TOO_MANY_REQUESTS.code,
                `${errorCodes.TOO_MANY_REQUESTS.message}，請 ${retrySeconds} 秒後重試`
            )
        );
    }
};

export default rateLimiterMiddleware;