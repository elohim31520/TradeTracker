const db = require('../../models')
const { calculateMean, calculateStdDev } = require('../js/util')
const Sequelize = require('sequelize')

const MOVING_AVERAGE = 10
const BTCUSD = 'BTCUSD'
const USOIL = 'USOIL'
const DXY = 'DXY'

const KEY_MAP = {
	BTCUSD: 'btc',
	USOIL: 'usoil',
	DXY: 'dxy'
}

const getStandardizedValue = (values, currentValue) => {
	const mean = calculateMean(values)
	const stdDev = calculateStdDev(values, mean)
	const standardizedValue = (currentValue - mean) / stdDev
	return parseFloat(standardizedValue.toFixed(2))
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

		const btcData = []
		const usoilData = []
		const dxyData = []

		data.forEach((item) => {
			switch (item.symbol) {
				case BTCUSD:
					btcData.push(item)
					break
				case USOIL:
					usoilData.push(item)
					break
				case DXY:
					dxyData.push(item)
					break
			}
		})

		const getMAPrices = (arr = [], movingAverage, currentIndex) => {
			return arr.slice(Math.max(0, currentIndex - movingAverage), currentIndex)
		}

		const standardizeData = (data, movingAverage) => {
			const prices = data.map((item) => item.price)
			return data.map((item, index) => {
				const windowPrices = getMAPrices(prices, movingAverage, index)
				return { ...item, volume: getStandardizedValue(windowPrices, item.price) }
			})
		}

		const btc_standardized = standardizeData(btcData, MOVING_AVERAGE)
		const dxy_standardized = standardizeData(dxyData, MOVING_AVERAGE)
		const usoil_standardized = standardizeData(usoilData, MOVING_AVERAGE)

		const consolidatedData = new Map()

		const addDataToMap = (data, key) => {
			data.forEach(({ createdAt, volume }) => {
				if (!consolidatedData.has(createdAt)) {
					consolidatedData.set(createdAt, { createdAt, btc: 0, usoil: 0, dxy: 0 })
				}
				consolidatedData.get(createdAt)[key] = volume
			})
		}

		addDataToMap(btc_standardized, KEY_MAP[BTCUSD])
		addDataToMap(usoil_standardized, KEY_MAP[USOIL])
		addDataToMap(dxy_standardized, KEY_MAP[DXY])

		const finalResult = Array.from(consolidatedData.values()).map(({ createdAt, btc, usoil, dxy }) => ({
			createdAt,
			volume: parseFloat((btc - 0.1 * dxy - 0.1 * usoil).toFixed(2)),
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
