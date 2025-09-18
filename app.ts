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
// import rateLimiterMiddleware, { initRateLimiter } from './src/middleware/rateLimiter'
import redisClient from './src/modules/redis'

// 路由
// import techNewsRoutes from './src/routes/technews'
import transactionRoutes from './src/routes/transactions'
import userRoutes from './src/routes/user'
import statementRoutes from './src/routes/statements'
import marketIndexRoutes from './src/routes/marketIndex'
import portfolioRoutes from './src/routes/portfolio'
import adminRoutes from './src/routes/admin'
import stockRoutes from './src/routes/stock'
import balanceRoutes from './src/routes/balances'
// import ollamaRoutes from './src/routes/ollama'

const app = express()
app.set('trust proxy', 1)
const port = process.env.PORT || 3000

// 設置信任代理，使 req.ip 能夠正確獲取客戶端 IP
// 數字 1 表示信任第一個代理，也可以使用 'loopback' 信任本地代理
// app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

// 確保連接並初始化應用
const initApp = async () => {
	// 基本中間件設置（不依賴 Redis）

	// 偵錯：在日誌中印出 CORS_ORIGIN 環境變數的實際值
	logger.info(`CORS_ORIGIN environment variable is: ${process.env.CORS_ORIGIN}`)

	const allowedOrigins = [process.env.CORS_ORIGIN].filter(Boolean)

	app.use(
		cors({
			origin: (origin, callback) => {
				// 允許沒有 origin 的請求 (例如 mobile apps, curl) 或是來自白名單的 origin
				if (!origin || allowedOrigins.includes(origin as string)) {
					callback(null, true)
				} else {
					// 記錄被阻擋的 origin 以便於除錯
					logger.warn(`CORS blocked for origin: ${origin}`)
					callback(new Error('Not allowed by CORS'))
				}
			},
			optionsSuccessStatus: 200,
		})
	)
	app.use(helmet())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	try {
		// 嘗試連接 Redis
		await redisClient.connect()
		logger.info('Redis 連接成功')

		// Redis 連接成功後初始化限流器
		// await initRateLimiter()

		// 註冊限流中間件
		// app.use(rateLimiterMiddleware)
		// logger.info('限流中間件已註冊')
	} catch (error) {
		logger.error('Redis 連接失敗:', error)

		// 即使 Redis 連接失敗，也註冊限流中間件（會使用內存限流）
		// await initRateLimiter()
		// app.use(rateLimiterMiddleware)
	}

	// 設置路由
	app.get('/', (req: Request, res: Response, next: NextFunction) => {
		next(new ForbiddenError())
	})

	app.use('/transactions', transactionRoutes)
	app.use('/users', userRoutes)
	app.use('/statements', statementRoutes)
	app.use('/market', marketIndexRoutes)
	app.use('/portfolio', portfolioRoutes)
	app.use('/admin', adminRoutes)
	app.use('/stock', stockRoutes)
	app.use('/balances', balanceRoutes)
	// app.use('/ollama', ollamaRoutes)

	app.use(errorHandler) //所有的api錯誤處理, 擺最後

	app.listen(port, () => {
		logger.info('Server start!')
	})
}

initApp().catch((err) => {
	logger.error('應用初始化錯誤:', err)
	process.exit(1)
})
