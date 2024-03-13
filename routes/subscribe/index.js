const express = require('express')
const router = express.Router()

const { verifyToken } = require('../../js/middleware');
const validate = require("./validate")
const Users = require('../../models/users')
const TechNews = require('../../models/techNews')
const { successResponse } = require('../../js/config')
const logger = require("../../logger.js")

const db = require('../../models')

// router.post("/news",
// 	verifyToken,
// 	validate.validateParamsOfSet,
// 	async (req, res) => {
// 		try {
// 			const data = await User_favorite_news.create(req.body)
// 			res.json(data)
// 		} catch (e) {
// 			logger.error(e.message)
// 			throw new Error(500)
// 		}
// 	}
// )

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
			const decoded = req.decoded
			const { userId } = decoded
			const { newsId } = req.body
			const data = await db.pk_user_technews.create({ userId, newsId })
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