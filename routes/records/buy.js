const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/buy")
const { getRecordsBy, addRecords, delRecords, updateRecords, getAvgRecords } = require("./index")
const { validateParams } = require("./validate")

router.get("/:userId", verifyToken, validateParams, getRecordsBy(modal))
router.post("/add", verifyToken, addRecords(modal))
router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))
router.post("/avg", verifyToken, getAvgRecords(modal))

module.exports = router