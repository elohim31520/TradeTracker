const logger = require('../logger')
const db = require('../models')

async function findStatementBySymbo(symbo) {
	try {
		const data = db.company_statements.findAll({
			where: {
				symbo,
			},
		})
		return data
	} catch (e) {
		logger.error('findStatementBySymbo: ' + e.message)
		throw new Error(500)
	}
}

module.exports = {
	findStatementBySymbo,
}
