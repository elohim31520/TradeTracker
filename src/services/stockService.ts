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
				SELECT DISTINCT DATE(timestamp) as date
				FROM stock_prices
				ORDER BY date DESC
				LIMIT 2
			`
			const dates: { date: string }[] = await db.sequelize.query(dateQuery, {
				type: QueryTypes.SELECT,
			})

			if (!dates.length) {
				return []
			}

			const fetchStocksByDate = async (date: string) => {
				const rawQuery = `
					SELECT name, symbol, price, chg, ychg, cap, time
					FROM (
						SELECT
							sp.company as name,
							c.symbol,
							sp.price,
							sp.day_chg AS chg,
							sp.year_chg AS ychg,
							sp.m_cap AS cap,
							DATE(sp.timestamp) as time,
							ROW_NUMBER() OVER (PARTITION BY sp.company ORDER BY sp.timestamp DESC) as rn
						FROM
							stock_prices sp
						LEFT JOIN
							company c ON LOWER(c.name) LIKE CONCAT('%', LOWER(TRIM(sp.company)), '%')
						WHERE
							DATE(sp.timestamp) = :targetDate
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
			let stocks = await fetchStocksByDate(latestDate)

			if (stocks.length < 20 && dates.length > 1) {
				const secondLatestDate = dates[1].date
				stocks = await fetchStocksByDate(secondLatestDate)
			}

			return stocks
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
