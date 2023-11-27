const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../js/middleware');

const TechNews = require("../../modal/techNews")
const sequelize = require("../../js/connect");
const dayjs = require("dayjs")
const { Op } = require("sequelize");
// const Users = require("../../modal/user")
const logger = require("../../logger")


router.post('/subscription',
	verifyToken,
	async (req, res) => {
		// let data = await TechNews.sqlQuerySubscriptionNews(req.body)
		// res.json(data)
	}
)

router.post("/",
	async (req, res) => {
		let { pageIndex, pageSize, endDate, startDate, query } = body

		if (!endDate) endDate = dayjs().toDate()
		if (!startDate) startDate = dayjs().startOf('day').subtract(1, 'day').toDate()
		let offset = (pageIndex - 1) * pageSize

		if (pageIndex <= 0) offset = 0
		try {
			const res = await TechNews.findAll({
				where: {
					release_time: {
						[Op.between]: [startDate, endDate],
					},
					[Op.or]: {
						title: {
							[Op.like]: `%${query}%`
						},
						web_url: {
							[Op.like]: `%${query}%`
						}
					}
				},
				offset,
				limit: pageSize,
				attributes: [
					'id', 'title', 'release_time', 'publisher', 'web_url',
					[
						sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-%d')`),
						'createdAt'
					]
				],
			})
			return res
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

router.post()

module.exports = router