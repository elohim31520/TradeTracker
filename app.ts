require('dotenv').config()
require('express-async-errors')
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { RateLimiterMemory } from 'rate-limiter-flexible'
//@ts-ignore
import logger from './src/logger'
//@ts-ignore
import errorHandler from './src/middleware/errorHandler'
//@ts-ignore
import { ForbiddenError } from './src/js/errors'
//@ts-ignore
import errorCodes from './src/constant/errorCodes'
//@ts-ignore
import responseHelper from './src/js/responseHelper'

const app = express()

const rateLimiter = new RateLimiterMemory({
	points: 10,
	duration: 1,
})

// Rate limiter middleware
const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
	rateLimiter
		.consume(req.ip as string)
		.then(() => {
			// Request allowed, proceed with handling the request
			next()
		})
		.catch(() => {
			// Request limit exceeded, respond with an appropriate error message
			res.json(responseHelper.fail(errorCodes.TOO_MANY_REQUESTS.code, errorCodes.TOO_MANY_REQUESTS.message))
		})
}

// Middleware setup
app.use(cors())
app.use(helmet())
app.use(rateLimiterMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.use(errorHandler)

app.listen(1234, () => {
	logger.info('Server start!')
})
