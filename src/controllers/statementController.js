const statementService = require('../services/statementService')
const _ = require('lodash')
const responseHelper = require('../modules/responseHelper')

class statementController {
	async getBySymbol(req, res, next) {
		try {
			const symbol = _.upperCase(_.get(req, 'params.symbol', ''))
			const days = _.get(req, 'query.days')
			const data = await statementService.getBySymbol(symbol, days)
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new statementController()
