const statementService = require('../services/statementService')
const _ = require('lodash')
const responseHelper = require('../modules/responseHelper')

class statementController {
	async getBySymbol(req, res, next) {
		try {
			const symbol = _.upperCase(_.get(req, 'params.symbol', ''))
			const data = await statementService.getBySymbol(symbol)
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new statementController()
