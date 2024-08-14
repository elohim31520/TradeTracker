require('dotenv').config()
require('express-async-errors')
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { RateLimiterMemory } from 'rate-limiter-flexible'
//@ts-ignore
import logger from './logger'
//@ts-ignore
import errorHandler from './middleware/errorHandler'
//@ts-ignore
import { ForbiddenError } from './js/errors'

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
			res.status(429).send('Too Many Requests')
		})
}

// Middleware setup
app.use(cors())
app.use(helmet())
app.use(rateLimiterMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)

if (process.env.DEBUG_MODE) {
	logger.info('In debug mode')
}
// Routes setup
app.get('/', (req: Request, res: Response, next: NextFunction) => {
	next(new ForbiddenError())
})

app.use('/technews', require('./routes/technews'))
app.use('/company-news', require('./routes/companyNews'))
app.use('/transactions', require('./routes/transactions'))
app.use('/users', require('./routes/user'))
app.use('/subscribe', require('./routes/subscribe'))
app.use('/statements', require('./routes/statements'))
app.use('/marketindex', require('./routes/marketIndex'))
app.use('/portfolio', require('./routes/portfolio'))

app.listen(1234, () => {
	logger.info('Server start!')
})
