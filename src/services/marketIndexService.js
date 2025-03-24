const db = require('../../models')
const { calculateMean, calculateStdDev, calculateCorrelation } = require('../js/math')
const Sequelize = require('sequelize')
const dayjs = require('dayjs')

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

	async getMomentumData(data) {
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
			const epsilon = 1e-6
			if (Math.abs(stdDev) < epsilon) return 0

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

		const btcVolumes = btc_standardized.map((item) => item.volume)
		const dxyVolumes = dxy_standardized.map((item) => item.volume)
		const usoilVolumes = usoil_standardized.map((item) => item.volume)
		const us10yVolumes = us10y_standardized.map((item) => item.volume)

		// 動態權重
		const baseWeight = 0.1
		const btcWeight = Math.max(
			0.6,
			0.8 + baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), btcVolumes.slice(-MOVING_AVERAGE))
		)
		const dxyWeight =
			baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), dxyVolumes.slice(-MOVING_AVERAGE))
		const usoilWeight =
			baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), usoilVolumes.slice(-MOVING_AVERAGE))
		let us10Weight =
			baseWeight *
			Math.abs(calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), us10yVolumes.slice(-MOVING_AVERAGE)))

		console.log(`權重 btc: ${btcWeight}, dxy: ${dxyWeight}, usoil: ${usoilWeight}, us10y: ${us10Weight}`)

		const finalResult = Array.from(consolidatedData.values()).map(({ createdAt, btc, usoil, dxy, us10y }) => {
			// 高利率情景
			if (us10y > 2) us10Weight *= 1.5
			const volume = btc * btcWeight + dxyWeight * dxy + usoilWeight * usoil + us10Weight * us10y

			return {
				createdAt,
				volume: parseFloat(volume.toFixed(2)),
			}
		})

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

	async getByDateRange(rangeInDays) {
		try {
			const startDate = dayjs().subtract(rangeInDays, 'day').format('YYYY-MM-DD HH:mm:ss')
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
				where: {
					createdAt: {
						[Sequelize.Op.gte]: startDate,
					},
				},

				raw: true,
				group: ['symbol', 'createdAt'],
				order: ['createdAt'],
			})
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	async getMomentumByDateRange(rangeInDays) {
		const data = await this.getByDateRange(rangeInDays)
		return this.getMomentumData(data)
	}

	async getAllMomentum() {
		const data = await this.getGroupedDataByTime()
		return this.getMomentumData(data)
	}
}

module.exports = new MarketIndexService()
