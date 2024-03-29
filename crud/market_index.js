const logger = require('../logger')
const db = require('../models')
const Sequelize = require('sequelize')

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

async function findAndGroupByTime() {
	try {
		const data = await db.market_index.findAll({
			attributes: [
				'symbol',
				[
					Sequelize.literal(
						'(SELECT price FROM market_index AS mi2 WHERE mi2.symbol = market_index.symbol AND mi2.createdAt = market_index.createdAt AND mi2.change = MAX(market_index.change) LIMIT 1)'
					),
					'price',
				],
				[Sequelize.fn('MAX', Sequelize.col('change')), 'change'],
				[Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d %H')"), 'createdAt'],
			],
			raw: true,
			group: ['symbol', 'createdAt'],
			order: ['createdAt'],
		})
		return data
	} catch (e) {
		logger.error('findAndGroupByTime: ' + e.message)
		throw Error(500)
	}
}

module.exports = {
	createMarketIndex,
	findLastOne,
	findAllMarketIndex,
	findAndGroupByTime,
}
