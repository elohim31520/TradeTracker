const winston = require('winston')
const fs = require('fs');
const path = require('path');

const logDirectory = 'log';
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(), // 加入時間戳記
		winston.format.json()
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: path.join(logDirectory, 'warn.log'), level: 'warn' }),
		new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
		new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') }),
	],
})

module.exports = logger