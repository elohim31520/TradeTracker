const { AppError } = require('../js/errors')

const errHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode
	err.status = err.status

	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		})
	} else {
		console.error('ERROR 💥', err)
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error!',
		})
	}
}

module.exports = errHandler
