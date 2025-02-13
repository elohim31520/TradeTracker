const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middleware/auth')
const Users = require('../../models/users')
const TechNews = require('../../models/techNews')
const { successResponse } = require('../js/config')
const logger = require('../logger.js')
const _get = require('lodash/get')
const validate = require('../middleware/validate')
const { createSchema } = require('../schemas/subscribeSchema')
const db = require('../../models')

router.get('/news', verifyToken, async (req, res) => {
	const decoded = req.decoded
	const { userId } = decoded
	try {
		const user = await Users.findByPk(userId, {
			include: {
				model: News,
				attributes: ['id'],
				through: { attributes: [] },
			},
		})

		const allNewsId = user.News.map((vo) => vo.id)

		const data = News.findAll({
			where: {
				id: allNewsId,
			},
		})

		res.json(data)
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
})

router.post('/technews', verifyToken, validate(createSchema), async (req, res) => {
	try {
		const user_name = _get(req.decoded, 'user_name', '')
		const { newsId } = req.body
		const user = await db.Users.findOne({
			where: { user_name },
			attributes: ['id'],
			rejectOnEmpty: true
		})
		await db.pk_user_technews.create({ userId: user.id, newsId })
		res.json(successResponse)
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
})

router.get('/technews', verifyToken, async (req, res) => {
	const user_name = _get(req.decoded, 'user_name', '')
	try {
		const result = await db.Users.findOne({
			where: { user_name },
			attributes: ['id'],
			include: [
				{
					model: TechNews,
					attributes: ['id', 'title', 'release_time', 'publisher', 'web_url'],
					through: {
						model: db.pk_user_technews,
						attributes: [],
					},
					require: false,
				},
			],
		})
		let resData = successResponse
		resData.data = result.dataValues.TechNews
		res.json(resData)
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
})

module.exports = router
