const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const model = require("../../models/transaction")
const crud = require("./crud")
const { validateParamsOfGet, validateParamsOfAdd, validateParamsOfDel, validateParamsOfUpdate } = require("./validate")
const { successResponse } = require('../../js/config')
const _ = require("lodash")

router.get("/:userId",
	verifyToken,
	validateParamsOfGet,
	crud.getRecordsBy(model),
	(req, res) => {
		let resData = successResponse
		resData.data = req.records
		res.json(resData)
	}
)

router.post("/",
	verifyToken,
	validateParamsOfAdd,
	crud.addRecords(model),
	(req, res) => {
		res.json(successResponse)
	}
)

router.delete("/:id",
	verifyToken,
	validateParamsOfDel,
	crud.delRecords(model),
	(req, res) => {
		res.json(successResponse)
	}
)

router.patch("/:id",
	verifyToken,
	validateParamsOfUpdate,
	crud.updateRecords(model),
	(req, res) => {
		res.json(successResponse)
	}
)

router.put("/:id",
	verifyToken,
	validateParamsOfUpdate,
	crud.updateRecords(model),
	(req, res) => {
		res.json(successResponse)
	}
)

module.exports = router