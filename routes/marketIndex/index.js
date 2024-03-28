const express = require('express')
const router = express.Router()
const crud = require('../../crud/market_index')
const { verifyToken } = require('../../js/middleware')

router.get('/', verifyToken, async (req, res) => {
	const data = await crud.findAllMarketIndex()
	res.json(data)
})

module.exports = router
