const marketService = require('../services/marketIndexService')
const _ = require('lodash')
const responseHelper = require('../js/responseHelper')
const redisClient = require('../js/redis').default

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
			if (redisClient && redisClient.isReady) {
				// 嘗試從 Redis 獲取數據
				const cachedData = await redisClient.get('marketWeight')
				if (cachedData) {
					return res.json(responseHelper.success(JSON.parse(cachedData)))
				}
			}

			// 從服務獲取數據
			const data = await marketService.getWeights()

			if (redisClient && redisClient.isReady) {
				redisClient
					.set('marketWeight', JSON.stringify(data), {
						EX: 3600,
					})
					.catch((e) => console.error('Redis 存儲錯誤:', e))
			}

			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getStockPrices(req, res, next) {
		try {
			const data = await marketService.getStockPrices()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getStockSymbol(req, res, next) {
		try {
			const data = await marketService.getStockSymbol()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getMarketBreadth(req, res, next) {
		try {
			const data = await marketService.getMarketBreadth()
			res.json(responseHelper.success(data))
		} catch (error) {
			next(error)
		}
	}

	async getStockWinners(req, res, next) {
		try {
			const data = await marketService.getStockDayChgSorted()
			const top5 = data.slice(0, 5)
			res.json(responseHelper.success(top5))
		} catch (error) {
			next(error)
		}
	}

	async getStockLosers(req, res, next) {
		try {
			const data = await marketService.getStockDayChgSorted()
			const len = data.length
			const last5 = data.slice(len - 5, len)
			res.json(responseHelper.success(last5))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new MarketIndexController()
