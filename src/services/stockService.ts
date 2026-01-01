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
			const dateQuery = `
				SELECT date 
				FROM stock_prices 
				ORDER BY id DESC 
				LIMIT 1;
			`
			const dates: { date: Date | string }[] = await db.sequelize.query(dateQuery, {
				type: QueryTypes.SELECT,
			})

			if (!dates.length) {
				return []
			}

			const fetchStocksByDate = async (date: Date | string) => {
				const rawQuery = `
					SELECT name, symbol, price, chg, ychg, cap, time
					FROM (
						SELECT
							c.name AS name,
							c.symbol AS symbol,
							p.price,
							p.day_chg AS chg,
							p.year_chg AS ychg,
							p.m_cap AS cap,
							p.date AS time,
							ROW_NUMBER() OVER (PARTITION BY p.company_id ORDER BY timestamp DESC) as rn
						FROM
							stock_prices p
						INNER JOIN company c ON p.company_id = c.id
						WHERE
							p.date = :targetDate
					) AS ranked_prices
					WHERE
						rn = 1;
				`
				const stocks = await db.sequelize.query(rawQuery, {
					replacements: { targetDate: date },
					type: QueryTypes.SELECT,
				})

				return stocks as StockPriceAlias[]
			}

			const latestDate = dates[0].date
			return await fetchStocksByDate(latestDate)
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
