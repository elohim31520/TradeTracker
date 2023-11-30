const express = require('express')
const router = express.Router()

const { verifyToken } = require('../../js/middleware');
const validate = require("./validate")
const User_favorite_news = require("../../modal/many_to_many/user_favorite_news")
const Users = require('../../models/user')
const TechNews = require('../../models/techNews')
const { successResponse } = require('../../js/config')
const logger = require("../../logger.js")

const db = require('../../models')
const pk_user_technews = db.pk_user_technews

router.post("/news",
	verifyToken,
	validate.validateParamsOfSet,
	async (req, res) => {
		try {
			const data = await User_favorite_news.create(req.body)
			res.json(data)
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

router.get("/news",
	verifyToken,
	async (req, res) => {
		const decoded = req.decoded
		const { userId } = decoded
		try {
			const user = await Users.findByPk(userId, {
				include: {
					model: News,
					attributes: ["id"],
					through: { attributes: [] }
				}
			})

			const allNewsId = user.News.map(vo => vo.id)

			const data = News.findAll({
				where: {
					id: allNewsId
				}
			})

			res.json(data)
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

router.post("/technews",
	verifyToken,
	validate.validateParamsOfSet,
	async (req, res) => {
		try {
			const data = await pk_user_technews.create(req.body)
			res.json(successResponse)
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

router.get('/technews',
	verifyToken,
	async (req, res) => {
		const decoded = req.decoded
		const { userId } = decoded
		try {
			await User_favorite_news.sync()
			const result = await Users.findByPk(userId, {
				attributes: ['userId'],
				include: [{
					model: TechNews,
					attributes: ['id', 'title', 'release_time', 'publisher', 'web_url'],
					through: 'pk_user_technews'
				}]
			})
			let resData = successResponse
			resData.data = result
			res.json(resData)
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

module.exports = router