require('dotenv').config()
require('express-async-errors')
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
//@ts-ignore
import logger from './src/logger'
//@ts-ignore
import errorHandler from './src/middleware/errorHandler'
//@ts-ignore
import { ForbiddenError } from './src/modules/errors'
import rateLimiterMiddleware, { initRateLimiter } from './src/middleware/rateLimiter'
import redisClient from './src/modules/redis'

// 路由
import techNewsRoutes from './src/routes/technews'
import companyNewsRoutes from './src/routes/companyNews'
import transactionRoutes from './src/routes/transactions'
import userRoutes from './src/routes/user'
import statementRoutes from './src/routes/statements'
import marketIndexRoutes from './src/routes/marketIndex'
import portfolioRoutes from './src/routes/portfolio'
import commentRoutes from './src/routes/comments'
import adminRoutes from './src/routes/admin'
import ollamaRoutes from './src/routes/ollama'

// 爬蟲
import { crawlMarketIndex } from './src/modules/crawler/marketIndex'
import { crawlCompanyMetrics } from './src/modules/crawler/companyMetrics'
import { crawlStockPrices } from './src/modules/crawler/stockPrices'

const app = express()
const port = process.env.PORT || 3000

// 設置信任代理，使 req.ip 能夠正確獲取客戶端 IP
// 數字 1 表示信任第一個代理，也可以使用 'loopback' 信任本地代理
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

// 確保連接並初始化應用
const initApp = async () => {
    // 基本中間件設置（不依賴 Redis）
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    
    try {
        // 嘗試連接 Redis
        await redisClient.connect()
        logger.info('Redis 連接成功')
        
        // Redis 連接成功後初始化限流器
        await initRateLimiter()
        
        // 註冊限流中間件
        app.use(rateLimiterMiddleware)
        logger.info('限流中間件已註冊')
    } catch (error) {
        logger.error('Redis 連接失敗:', error)
        logger.warn('使用無 Redis 的限流中間件')
        
        // 即使 Redis 連接失敗，也註冊限流中間件（會使用內存限流）
        await initRateLimiter()
        app.use(rateLimiterMiddleware)
    }
    
    // 在生產環境中，伺服器啟動時立即執行一次爬蟲任務
    if (process.env.NODE_ENV === 'production') {
        logger.info('生產環境：伺服器啟動，執行初始爬蟲任務...')
        crawlMarketIndex().catch(err => logger.error('初始 crawlMarketIndex 任務失敗:', err))
        crawlCompanyMetrics().catch(err => logger.error('初始 crawlCompanyMetrics 任務失敗:', err))
        crawlStockPrices().catch(err => logger.error('初始 crawlStockPrices 任務失敗:', err))
    }

    // 設置路由
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        next(new ForbiddenError())
    })
    
    app.use('/technews', techNewsRoutes)
    app.use('/company-news', companyNewsRoutes)
    app.use('/transactions', transactionRoutes)
    app.use('/users', userRoutes)
    app.use('/statements', statementRoutes)
    app.use('/market', marketIndexRoutes)
    app.use('/portfolio', portfolioRoutes)
    app.use('/comment', commentRoutes)
	app.use('/admin', adminRoutes)
    app.use('/ollama', ollamaRoutes)
    
    app.use(errorHandler) //所有的api錯誤處理, 擺最後
    
    app.listen(port, () => {
        logger.info('Server start!')
    })
}

initApp().catch(err => {
    logger.error('應用初始化錯誤:', err)
    process.exit(1)
})
