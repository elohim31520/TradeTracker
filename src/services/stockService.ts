const db = require('../../models')
import { QueryTypes } from 'sequelize'
import { StockPriceAlias } from '../types/stock'

class StockService {
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
			const chg = parseFloat(String(stock.chg).replace('%', ''))
			return chg > 0
		}).length

		return positiveStocks / totalStocks
	}

	async getTodayStocks(): Promise<StockPriceAlias[]> {
		try {
			const rawQuery = `
				SELECT name, price, chg, ychg, cap, time
				FROM (
					SELECT
						company as name,
						price,
						day_chg AS chg,
						year_chg AS ychg,
						m_cap AS cap,
						DATE(timestamp) as time,
						ROW_NUMBER() OVER (PARTITION BY company ORDER BY timestamp DESC) as rn
					FROM
						stock_prices
					WHERE
						DATE(timestamp) = (SELECT MAX(DATE(timestamp)) FROM stock_prices)
				) AS ranked_prices
				WHERE
					rn = 1;
			`

			const stocks = await db.sequelize.query(rawQuery, {
				type: QueryTypes.SELECT,
			})

			return stocks as StockPriceAlias[]
		} catch (error) {
			console.error("Error fetching today's stocks:", error)
			return []
		}
	}

	async getStockDayChgSorted() {
		const stocks = await this.getTodayStocks()
		const sortedStocks = stocks
			.map((stock) => ({
				...stock,
				chg: parseFloat(String(stock.chg).replace('%', '')),
			}))
			.sort((a, b) => b.chg - a.chg)
		return sortedStocks
	}
}

export default new StockService()
