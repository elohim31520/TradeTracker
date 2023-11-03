const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/holding")
const { successResponse } = require('../../js/config')
const { getRecordsBy, addRecords, delRecords, updateRecords, calculatePurchase } = require("./crud")
const { validateParamsOfGet, validateParamsOfAdd, validateParamsOfDel, validateParamsOfUpdate } = require("./validate")

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

router.post("/",
	verifyToken,
	validateParamsOfAdd,
	addRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

router.delete("/:id",
	verifyToken,
	validateParamsOfDel,
	delRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

router.patch("/:id",
	verifyToken,
	validateParamsOfUpdate,
	updateRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

router.put("/:id",
	verifyToken,
	validateParamsOfUpdate,
	updateRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

module.exports = router