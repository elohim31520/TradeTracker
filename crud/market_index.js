const logger = require('../logger')
const db = require('../models')

function createMarketIndex(params) {
	return db.market_index.create(params).catch((e) => {
		logger.warn('createMarketIndex: ' + e.message)
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

async function findAllMarketIndex() {
	try {
		const data = db.market_index.findAll()
		return data
	} catch (e) {
		logger.error('findAllMarketIndex: ' + e.message)
		throw new Error(500)
	}
}

module.exports = {
	createMarketIndex,
	findLastOne,
	findAllMarketIndex,
}
