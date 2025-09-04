const marketService = require('../services/marketIndexService')
const _ = require('lodash')
const responseHelper = require('../modules/responseHelper')

class MarketIndexController {
	async getAll(req, res, next) {
		try {
			const data = await marketService.getAll()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getMomentum(req, res, next) {
		try {
			const data = await marketService.getAllMomentum()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getLstOne(req, res, next) {
		try {
			const symbol = _.get(req, 'params.symbol', '').toUpperCase()
			const data = await marketService.getLstOne(symbol)
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getMarketIndicesByDays(req, res, next) {
		try {
			const days = +_.get(req, 'params.days')
			const data = await marketService.getMomentumByDateRange(days)
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getWeights(req, res, next) {
		try {
			const data = await marketService.getWeights()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getMarketDataBySymbol(req, res, next) {
		try {
			const symbol = _.get(req, 'params.symbol', '').toUpperCase()
			const page = Number(_.get(req, 'query.page', 1))
			const size = Number(_.get(req, 'query.size', 10))
			if (!symbol) {
				throw new ClientError('缺少Symbol參數')
			}
			const data = await marketService.getMarketDataBySymbol({symbol, page, size})
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new MarketIndexController()
