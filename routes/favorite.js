const express = require('express')
const router = express.Router()
const newsController = require("../crud/news");
const { verifyToken } = require('../js/middleware');
const validate = require("./favorite/validate")

router.post("/news/set",
	verifyToken,
	validate.validateParamsOfSet,
	async (req, res) => {
		const data = await newsController.sqlSetUserFavoriteNews(req.body)
		res.json(data)
	}
)

router.post("/news",
	verifyToken,
	async (req, res) => {
		const data = await newsController.sqlGetUserFavoriteNews(req)
		return res.json(data)
	}
)

module.exports = router