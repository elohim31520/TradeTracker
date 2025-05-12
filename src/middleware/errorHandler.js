const { AppError } = require('../js/errors')
const responseHelper = require('../js/responseHelper')
const errorCodes = require('../constant/errorCodes').default

const errHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode
	err.status = err.status
	console.log(err)
	if (err instanceof AppError) {
		res.status(err.statusCode).json(responseHelper.fail(err.statusCode, err.message))
	} else if (err.name == 'SequelizeUniqueConstraintError') {
		res.json(responseHelper.fail(errorCodes.DUPLICATE_ACCOUNT.code, errorCodes.DUPLICATE_ACCOUNT.message))
	} else {
		console.error('ERROR 💥', err)
		res.json(responseHelper.fail(errorCodes.SERVER_ERROR.code, errorCodes.SERVER_ERROR.message))
	}
}

module.exports = errHandler
