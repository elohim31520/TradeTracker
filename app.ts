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

const app = express()

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
    
    // 設置路由
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        next(new ForbiddenError())
    })
    
    app.use('/technews', require('./src/routes/technews'))
    app.use('/company-news', require('./src/routes/companyNews'))
    app.use('/transactions', require('./src/routes/transactions'))
    app.use('/users', require('./src/routes/user'))
    app.use('/userFavorite', require('./src/routes/userFavorite'))
    app.use('/statements', require('./src/routes/statements'))
    app.use('/market', require('./src/routes/marketIndex'))
    app.use('/portfolio', require('./src/routes/portfolio'))
    app.use('/comment', require('./src/routes/comments'))
	app.use('/admin', require('./src/routes/admin').default)
    app.use('/ollama', require('./src/routes/ollama').default)
    
    app.use(errorHandler) //所有的api錯誤處理, 擺最後
    
    app.listen(1234, () => {
        logger.info('Server start!')
    })
}

initApp().catch(err => {
    logger.error('應用初始化錯誤:', err)
    process.exit(1)
})
