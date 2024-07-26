class AppError extends Error {
	constructor(meeesage, statusCode) {
		super(meeesage)
		this.statusCode = statusCode
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

		Error.captureStackTrace(this, this.constructor)
	}
}

class ClientError extends AppError {
	constructor(message) {
		super(message, 400)
	}
}

class ServerError extends AppError {
	constructor(message) {
		super(message, 500)
	}
}

module.exports = {
	AppError,
	ClientError,
	ServerError,
}
