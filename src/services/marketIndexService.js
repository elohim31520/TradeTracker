const db = require('../../models')
const { calculateMean, calculateStdDev } = require('../js/util')
const Sequelize = require('sequelize')

const MOVING_AVERAGE = 10
const BTCUSD = 'BTCUSD'
const USOIL = 'USOIL'
const DXY = 'DXY'
const US10Y = 'US10Y'

const KEY_MAP = {
	BTCUSD: 'btc',
	USOIL: 'usoil',
	DXY: 'dxy',
	US10Y: 'us10y',
}

class MarketIndexService {
	async create(params) {
		try {
			const data = await db.market_index.create(params)
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	async getAll() {
		try {
			const data = db.market_index.findAll()
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	async getGroupedDataByTime() {
		try {
			const data = await db.market_index.findAll({
				attributes: [
					'symbol',
					[
						Sequelize.literal(
							'(SELECT price FROM market_index AS mi2 WHERE mi2.symbol = market_index.symbol AND mi2.createdAt = market_index.createdAt AND mi2.change = MAX(market_index.change) LIMIT 1)'
						),
						'price',
					],
					[Sequelize.fn('MAX', Sequelize.col('change')), 'change'],
					[Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d %H')"), 'createdAt'],
				],
				raw: true,
				group: ['symbol', 'createdAt'],
				order: ['createdAt'],
			})
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	async getMomentumData() {
		const data = await this.getGroupedDataByTime()

		const consolidatedData = new Map()
		const addDataToMap = (data, key) => {
			data.forEach(({ createdAt, volume }) => {
				if (!consolidatedData.has(createdAt)) {
					consolidatedData.set(createdAt, { createdAt, btc: 0, usoil: 0, dxy: 0, us10y: 0 })
				}
				consolidatedData.get(createdAt)[key] = volume
			})
		}

		const getStandardizedValue = (values, currentValue) => {
			const mean = calculateMean(values)
			const stdDev = calculateStdDev(values, mean)
			const diff = currentValue - mean
			if (diff == 0) return 0
			const standardizedValue = diff / stdDev
			return parseFloat(standardizedValue.toFixed(2))
		}

		const standardizeData = (data) => {
			const prices = data.map((item) => item.price)
			return data.map((item, index) => {
				const windowPrices = index < MOVING_AVERAGE ? prices : prices.slice(Math.max(0, index - MOVING_AVERAGE), index)
				return { ...item, volume: getStandardizedValue(windowPrices, item.price) }
			})
		}

		const btcData = data.filter((vo) => vo.symbol == BTCUSD)
		const usoilData = data.filter((vo) => vo.symbol == USOIL)
		const dxyData = data.filter((vo) => vo.symbol == DXY)
		const us10YData = data.filter((vo) => vo.symbol == US10Y)

		const btc_standardized = standardizeData(btcData)
		const dxy_standardized = standardizeData(dxyData)
		const usoil_standardized = standardizeData(usoilData)
		const us10y_standardized = standardizeData(us10YData)

		addDataToMap(btc_standardized, KEY_MAP[BTCUSD])
		addDataToMap(usoil_standardized, KEY_MAP[USOIL])
		addDataToMap(dxy_standardized, KEY_MAP[DXY])
		addDataToMap(us10y_standardized, KEY_MAP[US10Y])

		const finalResult = Array.from(consolidatedData.values()).map(({ createdAt, btc, usoil, dxy, us10y }) => ({
			createdAt,
			volume: parseFloat((btc * 0.8 - 0.05 * dxy - 0.05 * usoil - 0.1 * us10y).toFixed(2)),
		}))

		return finalResult
	}

	async getLstOne(symbol) {
		try {
			const lastOne = await db.market_index.findOne({
				where: {
					symbol,
				},
				order: [['createdAt', 'DESC']],
			})
			return lastOne
		} catch (error) {
			throw error
		}
	}
}

module.exports = new MarketIndexService()
