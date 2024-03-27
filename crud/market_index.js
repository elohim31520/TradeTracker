const logger = require('../logger')
const db = require('../models')

function bulkCreateMarketIndex(params) {
	return db.market_index.bulkCreate(params).catch((e) => {
		logger.warn('bulkCreateMarketIndex: ' + e.message)
	})
}

module.exports = {
	bulkCreateMarketIndex,
}