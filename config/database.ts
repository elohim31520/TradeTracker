import { Sequelize } from 'sequelize'
//@ts-ignore
import logger from '../src/logger'
require('dotenv').config()

const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD as string,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',
		define: {
			// timestamps: false
		},
		timezone: '+08:00',
	}
)

sequelize
	.authenticate()
	.then(() => {
		logger.info('=== SQL Connection has been established successfully ===')
	})
	.catch((error: Error) => {
		logger.error('Unable to connect to the database: ' + error.message)
	})

module.exports = sequelize
