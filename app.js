const express = require('express')
require('dotenv').config()
require('express-async-errors');
const helmet = require('helmet')
const { RateLimiterMemory } = require("rate-limiter-flexible");

const app = express()
const path = require('path');
const cors = require('cors');
const logger = require("./logger")
const errorHandler = require('./js/errorHandler')
require('./js/crawler')

app.use(cors());
app.use(helmet());

const rateLimiter = new RateLimiterMemory({
	points: 10,
	duration: 1
})

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.consume(req.ip)
		.then(() => {
			// request allowed, 
			// proceed with handling the request
			next()
		})
		.catch(() => {
			// request limit exceeded, 
			// respond with an appropriate error message
			res.status(429).send('Too Many Requests');
		})
}

app.use(rateLimiterMiddleware)

if (process.env.DEBUG_MODE) {
	logger.info("In debug mode")
}

// 配置解析表单请求体，类型为：application/app
app.use(express.json())
// 解析表单请求体，类型为：application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
	throw Error(403);
})

// app.use('/news/finv', require('./routes/news/finv'))
app.use('/news/tech', require('./routes/news/tech'))
app.use('/transactions', require('./routes/transactions'));
app.use('/users', require('./routes/user'))
app.use('/subscribe', require('./routes/subscribe'))
app.use('/statements', require('./routes/statements'))
app.use('/marketindex', require('./routes/marketIndex'))
app.use(errorHandler);

app.listen(1234, () => {
	logger.info('Server start!')
})