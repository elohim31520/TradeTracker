const _ = require("lodash");
const logger = require("../../logger.js");

const sequelize = require("../../js/connect");
const { Op } = require("sequelize");
const modal_holding = require("../../modal/records/holding")

function sqlGet(table, { userId = '', company = '' }) {
	let conditions = { userId }
	if (company) conditions.company = company
	return table.findAll({
		where: conditions
	})
}

async function sqlUpdate(table, params) {
	let criteria = {
		userId: params.userId,
		company: params.company
	}
	const record = await table.findOne({ where: criteria, raw: true })
	if (record) {
		return table.update(params, {
			where: criteria
		})
	} else {
		await sequelize.sync()
		return table.bulkCreate([params])
	}
}

function getRecordsBy(modal) {
	return async (req, res, next) => {
		const userId = req.params.userId
		const company = req.query.company
		try {
			req.records = await sqlGet(modal, { userId, company })
			next()
		} catch (e) {
			logger.error('getRecordsBy: ' + e.message)
			throw new Error(500)
		}
	}
}

function addRecords(modal) {
	return async (req, res, next) => {
		try {
			const arr = req.body
			await sequelize.sync()
			modal.bulkCreate(arr)
			next()
		} catch (e) {
			logger.error('addRecords: ' + e.message)
			throw new Error(500)
		}
	}
}

function delRecords(modal) {
	return async (req, res, next) => {
		try {
			const { id } = req.params
			const { userId, company } = req.query
			await modal.destroy({
				where: {
					id,
					userId,
					company
				}
			})
			next()
		} catch (e) {
			logger.error('delRecords: ' + e.message)
			throw new Error(500)
		}
	}
}

function updateRecords(modal) {
	return async (req, res, next) => {
		try {
			const data = req.body
			const { id } = req.params
			const { userId, company } = req.query
			await modal.update(data, {
				where: {
					id,
					userId,
					company
				}
			})
			next()
		} catch (e) {
			logger.error('updateRecords: ' + e.message)
			throw new Error(500)
		}
	}
}

function calculatePurchase() {
	return (req, res, next) => {
		const list = req.body
		list.forEach(async current => {
			try {
				const holdingData = await sqlGet(modal_holding, current)
				let temp

				if (_.isArray(holdingData) && holdingData.length) {
					let record = holdingData[0].dataValues
					let shareSum
					let totalSum

					shareSum = +record.share + +current.share
					totalSum = +record.total + +current.total

					let avgPrice = totalSum / shareSum

					temp = Object.assign({}, record, {
						total: totalSum,
						share: shareSum,
						price: avgPrice
					})
				} else {
					temp = current
				}
				console.log(temp)

				await sqlUpdate(modal_holding, temp)
			} catch (e) {
				logger.error('calculatePurchase: ' + e.message)
				throw new Error(500)
			}
		})
		next()
	}
}

function calculateSale() {
	return (req, res, next) => {
		const list = req.body
		list.forEach(async current => {
			try {
				const holdingData = await sqlGet(modal_holding, current)
				let temp

				if (_.isArray(holdingData) && holdingData.length) {
					let record = holdingData[0].dataValues
					let shareSum
					let totalSum

					shareSum = +record.share - +current.share
					totalSum = +record.total - +current.total

					let avgPrice = totalSum / shareSum

					temp = Object.assign({}, record, {
						total: totalSum,
						share: shareSum,
						price: avgPrice
					})
				} else {
					temp = current
				}

				console.log(temp);
				await sqlUpdate(modal_holding, temp)
			} catch (e) {
				logger.error('calculateSale: ' + e.message)
				throw new Error(500)
			}
		})
		next()
	}
}

function calculateTotalPrice(req, res, next) {
	const multiply = ({ price, share }) => price * share
	const data = req.body
	if (_.isArray(data) && data.length) {
		data.forEach(vo => {
			vo.total = multiply(vo)
		})
	} else {
		data.total = multiply(data)
	}
	next()
}

async function calculateSaleProfit(req, res, next) {
	try {
		let q = _.isArray(req.body) ? _.get(req.body, '[0]', {}) : req.body

		const result = await sqlGet(modal_holding, q)
		const avgPrice = _.get(JSON.parse(JSON.stringify(result)), '[0].price', null)
		const calculateProfit = ({ price }) => (+price - +avgPrice) / +avgPrice * 100

		if (_.isArray(req.body)) {
			req.body.forEach(vo => {
				vo.profit = calculateProfit(vo)
			})
		} else {
			req.body.profit = calculateProfit(req.body)
		}
		next()
	} catch (e) {
		logger.error('calculateSale: ' + e.message)
		throw new Error(500)
	}
}

module.exports = {
	getRecordsBy,
	delRecords,
	addRecords,
	updateRecords,
	calculatePurchase,
	calculateSale,
	calculateTotalPrice,
	calculateSaleProfit
}