const db = require('../../models')

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
	async getBySymbol(symbol: string): Promise<StatementAttributes[]> {
		try {
			const data = db.CompanyStatement.findAll({
				where: {
					symbol,
				},
			})
			return data
		} catch (e: any) {
			throw new Error('Not found by symbol')
		}
	}
}

module.exports = new StatementController()
