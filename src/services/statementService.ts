const db = require('../../models')

interface StatementAttributes {
	id: number
	symbo: string
	price: number
	PE_Trailing: number
	PE_Forward: number
	EPS_Trailing: number
	EPS_Forward: number
	volume: number
	marketCap: string
	createdAt: Date
	updatedAt: Date
}

class StatementController {
	async getBySymbol(symbol: string): Promise<StatementAttributes[]> {
		try {
			const data = db.company_statements.findAll({
				where: {
					symbo: symbol,
				},
			})
			return data
		} catch (e: any) {
			throw new Error('Not found by symbol')
		}
	}
}

module.exports = new StatementController()
