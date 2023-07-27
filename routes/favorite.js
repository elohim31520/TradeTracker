const express = require('express')
const router = express.Router()
const newsController = require("../crud/news");
const { verifyToken } = require('../js/middleware');
const validate = require("./favorite/validate")

router.post("/news/set", verifyToken, validate.validateParamsOfSet, async (req, res) => {
	try {
		const data = await newsController.sqlSetUserFavoriteNews(req.body)
		res.json(data)
	} catch (e) {
		res.json(e)
	}
})

router.post("/news", verifyToken, async (req, res) => {
	try {
		const data = await newsController.sqlGetUserFavoriteNews(req.body)
		return res.json(data)
	} catch (e) {
		res.json(e)
	}
})

module.exports = router