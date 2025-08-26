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
	async getBySymbol(symbol: string, days?: number): Promise<StatementAttributes[]> {
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
			const data = db.CompanyStatement.findAll({
				where: whereCondition,
				order: [['createdAt', 'DESC']],
			})
			return data
		} catch (e: any) {
			throw new Error('Not found by symbol')
		}
	}
}

module.exports = new StatementController()
