require('dotenv').config()
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')

// 為不同環境定義可重用的格式
const productionFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.errors({ stack: true }),
	winston.format.json()
)

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
		format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
	}),
]

transports.push(
	new ElasticsearchTransport({
		level: 'warn',
		clientOpts: { node: process.env.ELASTICSEARCH_URL },
		indexPrefix: 'ur-trade-logs',
		transformer: (logData) => {
			return {
				'@timestamp': new Date().toISOString(),
				'severity': logData.level,
				'message': logData.message,
				'fields': logData.meta,
			}
		},
	})
)

const logger = winston.createLogger({
	level: 'info',
	defaultMeta: { service: 'user-service' },
	transports: transports,
})

module.exports = logger
