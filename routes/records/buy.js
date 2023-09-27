const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/buy")
const modal_holding = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords, mergeRecordsToTable } = require("./index")
const { validateParamsOfGet, validateParamsOfAdd, validateParamsOfDel } = require("./validate")
const _ = require("lodash")

router.get("/:userId",
	verifyToken,
	validateParamsOfGet,
	getRecordsBy(modal),
	(req, res) => {
		res.json({ code: 1, msg: res.data })
	}
)

router.post("/add", verifyToken, validateParamsOfAdd, addRecords(modal), mergeRecordsToTable(modal_holding),
	(req, res) => {
		const data = req.commitData
		res.json({ code: 1, msg: "success", data })
	}
)

router.post("/del", verifyToken, validateParamsOfDel, delRecords(modal), (req, res) => {
	res.json({ code: 1, msg: "刪除成功" })
})

router.put("/put", verifyToken, updateRecords(modal), (req, res) => {
	res.json({ code: 1, msg: "更新成功" })
})

router.post("/avg", verifyToken, getAvgRecords(modal), (req, res) => {
	res.json({ code: 1, msg: "取得成功", data: req.records })
})

module.exports = router