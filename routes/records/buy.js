const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/buy")
const modal_holding = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords, mergeRecordsToTable } = require("./index")
const { validateParamsOfGet, validateParamsOfAdd, validateParamsOfDel } = require("./validate")
const { successResponse } = require('../../js/config')
const _ = require("lodash")

router.get("/:userId",
	verifyToken,
	validateParamsOfGet,
	getRecordsBy(modal),
	(req, res) => {
		let resData = successResponse
		resData.data = req.records
		res.json(resData)
	}
)

router.post("/add",
	verifyToken,
	validateParamsOfAdd,
	addRecords(modal),
	mergeRecordsToTable(modal_holding),
	(req, res) => {
		res.json(successResponse)
	}
)

router.post("/del", verifyToken, validateParamsOfDel, delRecords(modal), (req, res) => {
	res.json(successResponse)
})

router.put("/put", verifyToken, updateRecords(modal), (req, res) => {
	res.json(successResponse)
})

router.post("/avg", verifyToken, getAvgRecords(modal), (req, res) => {
	res.json(successResponse)
})

module.exports = router