const { AppError, ClientError, AuthError } = require('../modules/errors')
const responseHelper = require('../modules/responseHelper')
const errorCodes = require('../constant/errorCodes').default
const logger = require('../logger')

const errorHandlers = [
	{
		matches: (err) => err instanceof AuthError,
		handle: (err, res) => {
			res.status(401).json(responseHelper.fail(errorCodes.UNAUTHORIZED.code, err.message))
		},
	},
	{
		matches: (err) => err instanceof ClientError,
		handle: (err, res) => {
			const statusCode = errorCodes.MISSING_REQUIRED_PARAM.code
			res.status(statusCode).json(responseHelper.fail(statusCode, err.message))
		},
	},
	{
		matches: (err) => err instanceof AppError,
		handle: (err, res) => {
			res.status(err.statusCode).json(responseHelper.fail(err.statusCode, err.message))
		},
	},
	{
		matches: (err) => err.name === 'SequelizeUniqueConstraintError',
		handle: (err, res) => {
			const { code, message } = errorCodes.DUPLICATE_ACCOUNT
			res.status(409).json(responseHelper.fail(code, message))
		},
	},
	{
		matches: (err) => err.name === 'SequelizeDatabaseError',
		handle: (err, res) => {
			const { code, message } = errorCodes.WRONG_VALUE_FOR_FIELD
			res.status(400).json(responseHelper.fail(code, message))
		},
	},
]

const errHandler = (err, req, res, next) => {
	for (const handler of errorHandlers) {
		if (handler.matches(err)) {
			return handler.handle(err, res)
		}
	}

	console.error('ERROR 💥', err)
	logger.error(err)
	const { code, message } = errorCodes.SERVER_ERROR
	res.status(500).json(responseHelper.fail(code, message))
}

module.exports = errHandler
