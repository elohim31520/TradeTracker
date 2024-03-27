const logger = require('../logger')
const db = require('../models')

function bulkCreateMarketIndex(params) {
	return db.market_index.bulkCreate(params).catch((e) => {
		logger.warn('bulkCreateMarketIndex: ' + e.message)
	})
}

async function findLastOne(symbol) {
	try {
		const lastOne = db.market_index.findOne({
			where: {
				symbol,
			},
			order: [['createdAt', 'DESC']],
		})
		return lastOne
	} catch (e) {
		logger.error('findLastOne: ' + e.message)
		throw new Error(500)
	}
}

module.exports = {
	bulkCreateMarketIndex,
	findLastOne,
}
