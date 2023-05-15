const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/buy")
const { getRecordsBy, queryRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords, avgAllRecords } = require("./index")
const { validateParamsOfGet } = require("./validate")
const _ = require("lodash")

router.get("/:userId", verifyToken, validateParamsOfGet, getRecordsBy(modal), (req, res) => {
	res.json(req.records)
})

router.post("/add", verifyToken, addRecords(modal), queryRecordsBy(modal), (req, res, next) => {
	let records = req.records
	if (!_.isArray(records)) {
		res.json({ code: 0, msg: "failed in avg, no records" })
	}
	let shareSum = 0, totalSum = 0
	records.forEach(vo => {
		shareSum += +vo.share
		totalSum += +vo.total
	})
	const avgPrice = +totalSum / +shareSum

	req.commitData = Object.assign({}, req.body, {
		total: totalSum,
		share: shareSum,
		price: avgPrice
	})
	next()
}, (req, res) => {
	res.json(req.commitData)
})

router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))
router.post("/avg", verifyToken, getAvgRecords(modal))

module.exports = router