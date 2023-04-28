const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../js/middleware")
const modal = require("../../modal/records/sell")
const { getRecordsByName, addRecords, delRecords, updateRecords, getAvgRecords } = require("./index")

router.get("/:userId", verifyToken, getRecordsByName(modal))
router.post("/add", verifyToken, addRecords(modal))
router.post("/del", verifyToken, delRecords(modal))
router.put("/put", verifyToken, updateRecords(modal))
router.post("/avg", verifyToken, getAvgRecords(modal))

module.exports = router