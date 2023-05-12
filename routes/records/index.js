const { sqlGet, sqlUpdate, sqlCreate, sqlDelete, sqlGetAvg, sqlBulkCreate } = require("../../crud/records/index.js");
const _ = require("lodash")

function getRecordsBy(modal) {
	return async (req, res) => {
		const userId = req.params.userId
		const company = req.query.company
		try {
			const resp = await sqlGet(modal, { userId, company })
			res.json(resp)
		} catch (error) {
			console.log(error);
			res.json({ code: 0, msg: "sql get失敗" })
		}
		
	}
}

function addRecords(modal) {
	return (req, res) => {
		let params = req.body
		const isArray = _.isArray(params)
		if (!isArray) params = [req.body]
		sqlBulkCreate(modal, params).then(() => {
			res.json({ code: 1, msg: "寫入成功" })
		})
			.catch(e => {
				console.error('SQL寫入records失敗 : ', e);
				res.json({ code: 0, msg: "寫入失敗" })
			})
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
	return async (req, res) => {
		const { userId } = req.body
		if (!userId) {
			res.json({ code: -1, msg: "缺少參數" })
			return
		}
		try {
			const resp = await sqlGetAvg(modal, userId)
			res.json(resp)
		} catch (error) {
			console.log(error);
			console.log('query 平均失敗');
		}
	}
}

module.exports = {
	getRecordsBy,
	delRecords,
	addRecords,
	updateRecords,
	getAvgRecords
}