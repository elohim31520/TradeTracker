const db = require('../../models')
import { getStartOfToday, getEndOfToday } from '../modules/date'
import { StockPrice } from '../types/stock'

class StockService {
	async getStockPrices(): Promise<StockPrice[]> {
		const rawQuery = `
			SELECT id, symbol, company, price, dayChg, yearChg, MCap, date, timestamp, createdAt
			FROM (
				SELECT
					id,
					symbol,
					company,
					price,
					day_chg AS dayChg,
					year_chg AS yearChg,
					m_cap AS MCap,
					date,
					timestamp,
					created_at AS createdAt,
					ROW_NUMBER() OVER (PARTITION BY company ORDER BY created_at DESC) as rn
				FROM
					stock_prices
			) AS ranked_prices
			WHERE
				rn = 1;
		`
		const latestPrices = await db.sequelize.query(rawQuery, {
			type: db.sequelize.QueryTypes.SELECT,
			raw: true,
		})

		return latestPrices as StockPrice[]
	}

	async getStockSymbol() {
		const symbols = await db.Company.findAll({
			attributes: ['symbol', 'name'],
		})
		return symbols
	}

	async getMarketBreadth(): Promise<number> {
		const stocks = await this.getTodayStocks()
		const totalStocks = stocks.length
		if (!totalStocks) return 0
		const positiveStocks = stocks.filter((stock) => {
			const dayChg = parseFloat(String(stock.dayChg).replace('%', ''))
			return dayChg > 0
		}).length

		return positiveStocks / totalStocks
	}

	async getTodayStocks(): Promise<StockPrice[]> {
		const todayStart = getStartOfToday()
		const todayEnd = getEndOfToday()
		const rawQuery = `
			SELECT id, symbol, company, price, dayChg, yearChg, MCap, date, timestamp, createdAt
			FROM (
				SELECT
					id,
					symbol,
					company,
					price,
					day_chg AS dayChg,
					year_chg AS yearChg,
					m_cap AS MCap,
					date,
					timestamp,
					created_at AS createdAt,
					ROW_NUMBER() OVER (PARTITION BY company ORDER BY created_at DESC) as rn
				FROM
					stock_prices
				WHERE
					created_at BETWEEN :todayStart AND :todayEnd
			) AS ranked_prices
			WHERE
				rn = 1;
		`

		const stocks = await db.sequelize.query(rawQuery, {
			type: db.sequelize.QueryTypes.SELECT,
			raw: true,
			replacements: {
				todayStart: todayStart,
				todayEnd: todayEnd,
			},
		})

		return stocks as StockPrice[]
	}

	async getStockDayChgSorted() {
		const stocks = await this.getTodayStocks()
		const sortedStocks = stocks
			.map((stock) => ({
				...stock,
				dayChg: parseFloat(String(stock.dayChg).replace('%', '')),
			}))
			.sort((a, b) => b.dayChg - a.dayChg)
		return sortedStocks
	}
}

export default new StockService()
