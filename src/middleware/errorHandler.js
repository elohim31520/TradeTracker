const { AppError, ClientError, AuthError } = require('../js/errors')
const responseHelper = require('../js/responseHelper')
const errorCodes = require('../constant/errorCodes').default

const errHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode
	err.status = err.status
	if (err instanceof AuthError) {
		res.json(responseHelper.fail(errorCodes.UNAUTHORIZED.code, err.message))
	} else if (err instanceof ClientError) {
		res
			.status(errorCodes.MISSING_REQUIRED_PARAM.code)
			.json(responseHelper.fail(errorCodes.MISSING_REQUIRED_PARAM.code, err.message))
	} else if (err instanceof AppError) {
		res.status(err.statusCode).json(responseHelper.fail(err.statusCode, err.message))
	} else if (err.name == 'SequelizeUniqueConstraintError') {
		res.json(responseHelper.fail(errorCodes.DUPLICATE_ACCOUNT.code, errorCodes.DUPLICATE_ACCOUNT.message))
	} else if (err.name == 'SequelizeDatabaseError') {
		res.json(responseHelper.fail(errorCodes.WRONG_VALUE_FOR_FIELD.code, errorCodes.WRONG_VALUE_FOR_FIELD.message))
	} else {
		console.error('ERROR 💥', err)
		res.json(responseHelper.fail(errorCodes.SERVER_ERROR.code, errorCodes.SERVER_ERROR.message))
	}
}

module.exports = errHandler
