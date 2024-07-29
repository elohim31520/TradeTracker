const db = require('../models')

class StatementController {
	async getBySymbol(symbol) {
		try {
			const data = db.company_statements.findAll({
				where: {
					symbo: symbol,
				},
			})
			return data
		} catch (e) {
			throw new Error('Not found by symbol')
		}
	}
}

module.exports = new StatementController()
