const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/holding")
const { getRecordsBy, addRecords, delRecords, updateRecords } = require("./crud")
const { successResponse } = require('../../js/config')
const { validateParamsOfGet, validateParamsOfAdd, validateParamsOfDel } = require("./validate")

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

router.delete("/:id/:userId",
	verifyToken,
	validateParamsOfDel,
	delRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

router.patch("/:id",
	verifyToken,
	updateRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

router.put("/:id",
	verifyToken,
	updateRecords(modal),
	(req, res) => {
		res.json(successResponse)
	}
)

module.exports = router