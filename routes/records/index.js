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
		const { userId, company } = req.body
		try {
			req.records = await sqlGet(modal, { userId, company })
			next()
		} catch (err) {
			console.log(err);
			res.json({ code: 0, msg: "query 失敗" })
		}
	}
}

function addRecords(modal) {
	return async (req, res, next) => {
		let params = req.body
		const isArray = _.isArray(params)
		if (!isArray) params = [req.body]
		try {
			await sqlBulkCreate(modal, params)
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
	return (req, res) => {
		if (!req.body.data.id) {
			res.json({ code: 0, msg: "缺少參數 - id" })
			return
		}
		sqlUpdate(modal, req.body.data).then(resp => {
			res.json({ code: 1, msg: "更新成功" })
		})
			.catch(e => {
				console.error('SQL更新records失敗 : ', e);
				res.json({ code: 0, msg: "更新失敗" })
			})
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

function avgAllRecords() {
	return (req, res, next) => {
		let records = req.records
		if (!_.isArray(records)) {
			res.json({ code: 0, msg: "failed in avg, no records" })
		}
		if (_.isArray(req.body)) {
			records.concat(req.body)
		} else {
			records.push(req.body)
		}
		const shareSum = records.reduce((accumulator, obj) => accumulator + obj.share, 0)
		const totalSum = records.reduce((accumulator, obj) => accumulator + obj.total, 0)
		const avgPrice = shareSum / totalSum

		req.commitData = Object.assign(req.body, {
			total: totalSum,
			share: shareSum,
			price: avgPrice
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
	avgAllRecords,
}