const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/sell")
const modal_holding = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords, queryRecordsBy } = require("./index")
const { validateParamsOfGet } = require("./validate")

router.get("/:userId", verifyToken, validateParamsOfGet, getRecordsBy(modal), (req, res) => {
	res.json(req.records)
})

router.post("/add", verifyToken, addRecords(modal), queryRecordsBy(modal_holding), (req, res, next) => {
	let record = req.records[0],
		current = req.body

	if (!record) {
		req.commitData = current
		next()
	}
	let shareSum = +record.share - +current.share,
		totalSum = +record.total - +current.total,
		avgPrice = totalSum / shareSum

	req.commitData = Object.assign({}, req.body, {
		total: totalSum,
		share: shareSum,
		price: avgPrice
	})
	next()
}, updateRecords(modal_holding), (req, res) => {
	const data = req.commitData
	res.json({ code: 1, msg: "success", data })
})

router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))
router.post("/avg", verifyToken, getAvgRecords(modal))

module.exports = router