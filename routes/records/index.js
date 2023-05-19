const { sqlGet, sqlUpdate, sqlCreate, sqlDelete, sqlGetAvg, sqlBulkCreate } = require("../../crud/records/index.js");
const _ = require("lodash")

function getRecordsBy(modal) {
	return async (req, res, next) => {
		const userId = req.params.userId
		const company = req.query.company
		try {
			req.records = await sqlGet(modal, { userId, company })
			next()
		} catch (err) {
			console.log(err);
			res.json({ code: 0, msg: "get 失敗" })
		}
	}
}

function queryRecordsBy(modal) {
	return async (req, res, next) => {
		try {
			req.records = await sqlGet(modal, req.body)
			next()
		} catch (err) {
			console.log(err);
			res.json({ code: 0, msg: "query 失敗" })
		}
	}
}

function addRecords(modal) {
	return async (req, res, next) => {
		try {
			await sqlBulkCreate(modal, req.body)
			next()
		} catch (e) {
			res.json({ code: 0, msg: "寫入失敗" })
		}
	}
}

function delRecords(modal) {
	return async (req, res) => {
		const { userId, id } = req.body
		if (!userId || (!id && id != 0)) {
			res.status(401).json({ code: -1, msg: "缺少參數" })
			return
		}
		try {
			await sqlDelete(modal, { userId, id })
			res.json({ code: 1, msg: "刪除成功" })
		} catch (e) {
			console.error('SQL刪除records失敗 : ', e);
			res.json({ code: 0, msg: "刪除失敗" })
		}
	}
}

function updateRecords(modal) {
	return async (req, res, next) => {
		try {
			const data = req.body
			await sqlUpdate(modal, data)
			next()
		} catch (err) {
			console.log(err);
			res.json({ code: 0, msg: "SQL更新records失敗" })
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
		} catch (error) {
			console.log(error);
			console.log('query 平均失敗');
		}
	}
}

function mergeRecordsToTable(table) {
	return (req, res, next) => {
		const list = req.body
		list.forEach(async vo => {
			try {
				const holdingData = await sqlGet(table, vo)
				let temp
				if (_.isArray(holdingData) && holdingData.length) {
					let record = holdingData[0],
						current = vo
					let shareSum = +record.share + +current.share,
						totalSum = +record.total + +current.total,
						avgPrice = totalSum / shareSum

					temp = Object.assign({}, req.body, {
						total: totalSum,
						share: shareSum,
						price: avgPrice
					})
				} else temp = vo

				await sqlUpdate(table, temp)
			} catch (err) {
				console.log(err);
				console.error("mergeRecordsToTable Error!", vo);
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