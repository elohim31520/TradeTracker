const db = require('../../models')
const { calculateMean, calculateStdDev, calculateCorrelation } = require('../modules/math')
const Sequelize = require('sequelize')
const { MOVING_AVERAGE, BTCUSD, USOIL, DXY, US10Y, XAUUSD } = require('../constant/market')
const {
	getZonedDate,
	subtractDays,
	getStartOfToday,
	getEndOfToday,
} = require('../modules/date')

const KEY_MAP = {
	BTCUSD: 'btc',
	USOIL: 'usoil',
	DXY: 'dxy',
	US10Y: 'us10y',
}

class MarketIndexService {
	async create(params) {
		const data = await db.MarketIndex.create(params)
		return data
	}

	async getAll() {
		const data = db.MarketIndex.findAll()
		return data
	}

	async getGroupedDataByTime() {
		const data = await db.MarketIndex.findAll({
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
			if (us10y > 4.5) us10Weight *= 2
			const volume = btc * btcWeight + dxyWeight * dxy + usoilWeight * usoil + us10Weight * us10y

			return {
				createdAt,
				volume: parseFloat(volume.toFixed(2)),
			}
		})

		return finalResult
	}

	async getLstOne(symbol) {
		const lastOne = await db.MarketIndex.findOne({
			where: {
				symbol,
			},
			order: [['createdAt', 'DESC']],
		})
		return lastOne
	}

	async getByDateRange(rangeInDays) {
		const startDate = subtractDays(getZonedDate(), rangeInDays)
		const data = await db.MarketIndex.findAll({
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
	}

	async getMomentumByDateRange(rangeInDays) {
		const data = await this.getByDateRange(rangeInDays)
		return this.getMomentumData(data)
	}

	async getAllMomentum() {
		const data = await this.getGroupedDataByTime()
		return this.getMomentumData(data)
	}

	async getWeights() {
		const data = await this.getByDateRange(MOVING_AVERAGE)
		const getPrices = (symbol) => data.filter((d) => d.symbol === symbol).map((d) => d.price)

		const prices = {
			[BTCUSD]: getPrices(BTCUSD),
			[DXY]: getPrices(DXY),
			[USOIL]: getPrices(USOIL),
			[US10Y]: getPrices(US10Y),
			[XAUUSD]: getPrices(XAUUSD),
		}

		const btcSlice = prices.BTCUSD.slice(-MOVING_AVERAGE)
		const baseWeight = 0.1
		const getCorrelation = (values, values2) => baseWeight * calculateCorrelation(values, values2)

		return {
			[BTCUSD]: Number(Math.max(0.6, 0.8 + getCorrelation(btcSlice, btcSlice)).toFixed(3)),
			[DXY]: Number(getCorrelation(btcSlice, prices.DXY.slice(-MOVING_AVERAGE)).toFixed(3)),
			[USOIL]: Number(getCorrelation(btcSlice, prices.USOIL.slice(-MOVING_AVERAGE)).toFixed(3)),
			[US10Y]: Number(getCorrelation(btcSlice, prices.US10Y.slice(-MOVING_AVERAGE)).toFixed(3)),
			[XAUUSD]: Number(getCorrelation(btcSlice, prices.XAUUSD.slice(-MOVING_AVERAGE)).toFixed(3)),
		}
	}

	async getStockPrices() {
		const latestPrices = await db.StockPrice.findAll({
			attributes: ['company', 'symbol', 'price', 'MCap', 'date', 'createdAt'],
			where: {
				id: {
					[Sequelize.Op.in]: Sequelize.literal(`
						(SELECT id
							FROM StockPrices
								WHERE (company, createdAt) IN (
								SELECT company, MAX(createdAt)
								FROM StockPrices
								GROUP BY company
						))
					`),
				},
			},
		})
		return latestPrices
	}

	async getStockSymbol() {
		const symbols = await db.Company.findAll({
			attributes: ['symbol', 'name'],
		})
		return symbols
	}

	async getMarketBreadth() {
		const stocks = await this.getTodayStocks()
		const totalStocks = stocks.length
		if (!totalStocks) return 0
		const positiveStocks = stocks.filter((stock) => {
			const dayChg = parseFloat(stock.dayChg.replace('%', ''))
			return dayChg > 0
		}).length

		return positiveStocks / totalStocks
	}

	async getTodayStocks() {
		const todayStart = getStartOfToday()
		const todayEnd = getEndOfToday()
		const stocks = await db.StockPrice.findAll({
			where: {
				[Sequelize.Op.and]: [
					{
						createdAt: {
							[Sequelize.Op.between]: [todayStart, todayEnd],
						},
					},
					Sequelize.literal(`
							(company, createdAt) IN (
							SELECT company, MAX(createdAt)
							FROM StockPrices
							WHERE createdAt BETWEEN :todayStart AND :todayEnd
							GROUP BY company
							)
						`),
				],
			},
			replacements: {
				todayStart: todayStart,
				todayEnd: todayEnd,
			},
			raw: true,
		})
		return stocks
	}

	async getStockDayChgSorted() {
		const stocks = await this.getTodayStocks()
		const sortedStocks = stocks
			.map((stock) => ({
				...stock,
				dayChg: parseFloat(stock.dayChg.replace('%', '')),
			}))
			.sort((a, b) => b.dayChg - a.dayChg)
		return sortedStocks
	}
}

module.exports = new MarketIndexService()
