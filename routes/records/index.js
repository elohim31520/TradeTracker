const { sqlGet, sqlUpdate, sqlCreate, sqlDelete, sqlGetAvg, sqlBulkCreate } = require("../../crud/records/index.js");
const _ = require("lodash");
const logger = require("../../logger.js");

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

function queryRecordsBy(modal) {
	return async (req, res, next) => {
		try {
			req.records = await sqlGet(modal, req.body)
			next()
		} catch (e) {
			logger.error('queryRecordsBy: ' + e.message)
			throw new Error(500)
		}
	}
}

function addRecords(modal) {
	return async (req, res, next) => {
		try {
			await sqlBulkCreate(modal, req.body)
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
			const isDone = await sqlDelete(modal, req.body)
			if (isDone == 0) {
				res.json({ code: 0, msg: "無法刪除" })
			}
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

function getAvgRecords(modal) {
	return async (req, res, next) => {
		const { userId } = req.body
		if (!userId) {
			res.json({ code: -1, msg: "缺少參數" })
			return
		}
		try {
			req.records = await sqlGetAvg(modal, userId)
			next()
		} catch (e) {
			logger.error('getAvgRecords: ' + e.message)
			throw new Error(500)
		}
	}
}

function mergeRecordsToTable(table, operator = "+") {
	return (req, res, next) => {
		const list = req.body
		list.forEach(async vo => {
			try {
				const holdingData = await sqlGet(table, vo)
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
				await sqlUpdate(table, temp)
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
	queryRecordsBy,
	delRecords,
	addRecords,
	updateRecords,
	getAvgRecords,
	mergeRecordsToTable
}