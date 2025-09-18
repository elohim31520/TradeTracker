import { RateLimiterRedis, RateLimiterMemory, IRateLimiterOptions } from 'rate-limiter-flexible'
import express, { Request, Response, NextFunction } from 'express'
//@ts-ignore
import errorCodes from '../constant/errorCodes'
const responseHelper = require('../modules/responseHelper')
//@ts-ignore
import redisClient from '../modules/redis'
//@ts-ignore
import logger from '../logger'

// 可調整參數
const MAX_POINTS = 20 // 每秒請求數限制
const DURATION = 10    // 時間窗口大小（秒）
const KEY_PREFIX = 'rate_limit:'

// 環境檢測
const isDevelopment = process.env.NODE_ENV === 'development';

let rateLimiter: RateLimiterRedis | RateLimiterMemory | null = null;

const getRateLimiter = () => {
	if (redisClient && redisClient.isReady) {
		return new RateLimiterRedis({
			storeClient: redisClient,
			keyPrefix: KEY_PREFIX,
			points: MAX_POINTS,
			duration: DURATION,
		});
	} else {
		// Redis 不可用，使用內存進行限流
		return new RateLimiterMemory({
			points: MAX_POINTS,
			duration: DURATION,
		});
	}
};

// 導出初始化函數，可以在 Redis 連接成功後調用
export const initRateLimiter = async (): Promise<void> => {
	try {
		rateLimiter = getRateLimiter();
		logger.info('限流器初始化成功');
	} catch (e) {
		logger.error('限流器初始化失敗:', e);
		// 即使初始化失敗，也設置一個內存限流器作為備用
		rateLimiter = new RateLimiterMemory({
			points: MAX_POINTS,
			duration: DURATION,
		});
	}
};

// 獲取客戶端 IP 的函數
const getClientIp = (req: Request): string => {
	// 從各種可能的來源獲取 IP
	const xForwardedFor = req.headers['x-forwarded-for'];
	
	if (xForwardedFor) {
		// 如果有 X-Forwarded-For 頭，取第一個 IP（最原始的客戶端 IP）
		const ips = Array.isArray(xForwardedFor) 
			? xForwardedFor[0] 
			: xForwardedFor.split(',')[0].trim();
		return ips || req.ip || req.socket.remoteAddress || 'unknown';
	}
	
	return req.ip || req.socket.remoteAddress || 'unknown';
};

const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// 開發環境跳過限流
	if (isDevelopment) {
		return next();
	}
	
	// 獲取客戶端 IP
	const clientIp = getClientIp(req);
	
	// 調試信息：輸出請求詳情
	const debugInfo = {
		rawIp: req.ip,
		clientIp,
		path: req.path,
		headers: {
			'x-forwarded-for': req.headers['x-forwarded-for'],
			'user-agent': req.headers['user-agent']
		}
	};
	
	// 排除某些不需要限流的路徑
	if (req.path.startsWith('/public') || req.path === '/health') {
		return next();
	}
	
	// 跳過對本地請求的限流
	if (clientIp === '::1' || clientIp === '127.0.0.1') {
		logger.debug('本地請求，跳過限流', debugInfo);
		return next();
	}
	
	if (!rateLimiter) {
		// 限流器未初始化，跳過限流檢查
		return next();
	}

	rateLimiter
		.consume(clientIp)
		.then(() => {
			next();
		})
		.catch((rejRes) => {
			// 紀錄被限流的請求詳情
			logger.warn(`請求被限流: ${clientIp}`, { 
				...debugInfo,
				remainingPoints: rejRes.remainingPoints,
				msBeforeNext: rejRes.msBeforeNext
			});
			
			res.json(responseHelper.fail(
				errorCodes.TOO_MANY_REQUESTS.code, 
				`${errorCodes.TOO_MANY_REQUESTS.message}，請 ${Math.ceil(rejRes.msBeforeNext)} 毫秒後重試`
			));
		});
};

export default rateLimiterMiddleware;