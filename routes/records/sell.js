const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/sell")
const modal_holding = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords, mergeRecordsToTable } = require("./index")
const { validateParamsOfGet, validateParamsOfAdd } = require("./validate")

router.get("/:userId", verifyToken, validateParamsOfGet, getRecordsBy(modal), (req, res) => {
	res.json(req.records)
})

router.post("/add", verifyToken, validateParamsOfAdd, addRecords(modal), mergeRecordsToTable(modal_holding, "-"),
	(req, res) => {
		const data = req.commitData
		res.json({ code: 1, msg: "success", data })
	}
)

router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))

module.exports = router