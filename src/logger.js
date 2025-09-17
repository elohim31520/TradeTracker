require('dotenv').config()
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const fs = require('fs')

const logDir = 'logs'

// 確保日誌目錄存在
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

// 為不同環境定義可重用的格式
const productionFormat = winston.format.combine(
	winston.format.timestamp(),
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

// 在所有環境下都啟用檔案日誌輪替
transports.push(
	new DailyRotateFile({
		level: 'warn',
		filename: `${logDir}/application-%DATE%.log`,
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true, // 壓縮舊日誌
		maxSize: '20m', // 每個檔案最大 20MB
		maxFiles: '30d', // 保留 30 天的日誌
		format: productionFormat, // 檔案日誌一律使用 JSON 格式
	})
)

const logger = winston.createLogger({
	level: 'info',
	defaultMeta: { service: 'user-service' },
	transports: transports,
})

module.exports = logger
