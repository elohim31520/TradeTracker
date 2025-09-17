require('dotenv').config()
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')
const ecsFormat = require('@elastic/ecs-winston-format')

// 為不同環境定義可重用的格式
const developmentFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
	),
	winston.format.errors({ stack: true })
)

// 根據環境決定要使用的 transports
const transports = [
	new winston.transports.Console({
		format: process.env.NODE_ENV === 'production' ? ecsFormat() : developmentFormat,
	}),
]

transports.push(
	new ElasticsearchTransport({
		level: 'warn',
		format: ecsFormat(),
		clientOpts: {
			node: process.env.ELASTICSEARCH_URL,
			auth: {
				username: 'elastic',
				password: process.env.ELASTIC_PASSWORD,
			},
			ssl: {
				rejectUnauthorized: process.env.ELASTIC_PASSWORD ? true : false,
			},
		},
		indexPrefix: 'ur-trade-logs',
	})
)

const logger = winston.createLogger({
	level: 'info',
	defaultMeta: { service: 'user-service' },
	transports: transports,
})

module.exports = logger
