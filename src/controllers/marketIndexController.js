const marketIndexService = require('../services/marketIndexService')
const _ = require('lodash')
const { ClientError } = require('../js/errors')

class MarketIndexController {
	async getAll(req, res, next) {
		try {
			const data = await marketIndexService.getAll()
			res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async getMomentum(req, res, next) {
		try {
			const data = await marketIndexService.getMomentumData()
			res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async getLstOne(req, res, next) {
		try {
			const symbol = _.get(req, 'params.symbol', '').toUpperCase()
			if (!symbol || symbol == 'undefined') {
				next(new ClientError('Missing or invalid symbol parameter'))
			}
			const data = await marketIndexService.getLstOne(symbol)
			res.json(data)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new MarketIndexController()
