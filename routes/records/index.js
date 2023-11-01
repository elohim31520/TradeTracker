const _ = require("lodash");
const logger = require("../../logger.js");

const sequelize = require("../../js/connect");
const { Op } = require("sequelize");

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
		return table.bulkCreate([ params ])
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
			const { id, userId } = req.params
			await modal.destroy({
				where: {
					id,
					userId
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
			await sqlUpdate(modal, data)
			next()
		} catch (e) {
			logger.error('updateRecords: ' + e.message)
			throw new Error(500)
		}
	}
}

function mergeRecordsToTable(modal, operator = "+") {
	return (req, res, next) => {
		const list = req.body
		list.forEach(async vo => {
			try {
				const holdingData = await sqlGet(modal, vo)
				let temp,
					current = vo

				if (_.isArray(holdingData) && holdingData.length) {
					let record = holdingData[0].dataValues
					let shareSum,
						totalSum

					if (operator == "+") {
						shareSum = +record.share + +current.share
						totalSum = +record.total + +current.total
					} else {
						shareSum = +record.share - +current.share
						totalSum = +record.total - +current.total
					}
					let avgPrice = totalSum / shareSum

					temp = Object.assign({}, record, {
						total: totalSum,
						share: shareSum,
						price: avgPrice
					})
				} else temp = current
				console.log(temp);
				await sqlUpdate(modal, temp)
			} catch (e) {
				logger.error('mergeRecordsToTable: ' + e.message)
				throw new Error(500)
			}
		})
		next()
	}
}

module.exports = {
	getRecordsBy,
	delRecords,
	addRecords,
	updateRecords,
	mergeRecordsToTable
}