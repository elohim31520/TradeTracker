const winston = require('winston')
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
require('winston-daily-rotate-file');

moment.tz.setDefault('Asia/Taipei');

const logDirectory = 'log';
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

const defaultOptions = {
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.json()
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.DailyRotateFile({
			filename: path.join(logDirectory, 'warn-%DATE%.log'),
			level: 'warn',
			...defaultOptions
		}),
		new winston.transports.DailyRotateFile({
			filename: path.join(logDirectory, 'error-%DATE%.log'),
			level: 'error',
			...defaultOptions
		}),
		new winston.transports.DailyRotateFile({
			filename: path.join(logDirectory, 'info-%DATE%.log'),
			level: 'info',
			...defaultOptions
		})
	],
})

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		)
	}));
}

module.exports = logger