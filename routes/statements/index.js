const express = require('express')
const router = express.Router()
const crud = require('../../crud/statements')

router.get('/:symbol', async (req, res) => {
	const { symbol } = req.params
	if (!symbol) {
		throw new Error(400)
	}
	const data = await crud.findStatementBySymbo(symbol)
	res.json(data)
})

module.exports = router
