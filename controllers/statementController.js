const statementService = require('../services/statementService')
const _ = require('lodash')
const { ClientError } = require('../js/errors')

class statementController {
	async getBySymbol(req, res, next) {
		const symbol = _.get(req, 'params.symbol', null)
		if (!symbol) {
			next(new ClientError())
		}
		const data = await statementService.getBySymbol(symbol)
		res.status(200).json(data)
	}
}

module.exports = new statementController()
