const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords } = require("./index")
const { validateParamsOfGet } = require("./validate")

router.get("/:userId", verifyToken, validateParamsOfGet, getRecordsBy(modal), (req, res) => {
	res.json(req.records)
})

router.post("/add", verifyToken, addRecords(modal), (req, res) => {
	res.json({code: 1, msg: "寫入成功"})
})

router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))
router.post("/avg", verifyToken, getAvgRecords(modal))

module.exports = router