const express = require('express')
const router = express.Router()
const News = require("../../crud/news");
const { verifyToken } = require('../../js/middleware');
const validate = require("./validate")
const User_favorite_news = require("../../modal/many_to_many/user_favorite_news")

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

router.post("/news",
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

module.exports = router