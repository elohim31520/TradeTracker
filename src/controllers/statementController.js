const statementService = require('../services/statementService')
const _ = require('lodash')
const { ClientError } = require('../js/errors')
const responseHelper = require('../js/responseHelper')

class statementController {
	async getBySymbol(req, res, next) {
		try {
			const symbol = _.get(req, 'params.symbol', null)
			if (!symbol) {
				throw new ClientError('Symbol parameter is required')
			}
			const data = await statementService.getBySymbol(symbol)
			res.status(200).json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new statementController()
