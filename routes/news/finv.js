const express = require('express')
const router = express.Router()
const newsModel = require("../crud/news");
const { verifyToken } = require('../middleware/auth');

router.post('/subscription',
	verifyToken,
	async (req, res) => {
		let data = await newsModel.sqlQuerySubscriptionNews(req.body)
		res.json(data)
	}
)

router.post("/",
	async (req, res) => {
		const data = await newsModel.sqlQueryAll(req.body)
		res.json(data)
	}
)

router.post()

module.exports = router