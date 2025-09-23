const db = require('../../models')
const { Op } = require('sequelize')
import { getZonedDate, subtractDays } from '../modules/date'

interface StatementAttributes {
	id: number
	symbol: string
	price: number
	peTrailing: number
	peForward: number
	epsTrailing: number
	epsForward: number
	volume: number
	marketCap: string
	createdAt: Date
	updatedAt: Date
}

class StatementController {
	static async getBySymbol(symbol: string, days?: number): Promise<StatementAttributes[]> {
		try {
			const whereCondition: {
				symbol: string
				createdAt?: any
			} = {
				symbol,
			}

			if (days) {
				const date = subtractDays(getZonedDate(), Number(days))
				whereCondition.createdAt = {
					[Op.gte]: date,
				}
			}
			const data = await db.CompanyStatement.findAll({
				attributes: [
					['symbol', 'sb'],
					['price', 'pr'],
					['pe_trailing', 'pe'],
					['pe_forward', 'fpe'],
					['eps_trailing', 'eps'],
					['eps_forward', 'feps'],
					['volume', 'v'],
					['market_cap', 'cap'],
					['created_at', 'ct'],
				],
				where: whereCondition,
				order: [['created_at', 'DESC']],
			})
			return data
		} catch (e: any) {
			console.error('Failed to get company statement:', e)
			throw new Error('Error fetching data from database.')
		}
	}
}

module.exports = StatementController
