const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../js/middleware');

const TechNews = require("../../models/techNews")
const sequelize = require("../../js/connect");
const dayjs = require("dayjs")
const { Op } = require("sequelize");
// const Users = require("../../models/user")
const logger = require("../../logger")
const { successResponse } = require('../../js/config')


// router.post('/subscription',
// 	verifyToken,
// 	async (req, res) => {
// 		let data = await TechNews.sqlQuerySubscriptionNews(req.body)
// 		res.json(data)
// 	}
// )

router.get('/:id',
	async (req, res) => {
		let id = req.params.id
		try {
			const result = await TechNews.findOne({
				where: {
					id
				},
				attributes: [
					'id', 'title', 'release_time', 'publisher', 'web_url',
					[
						sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-%d')`),
						'createdAt'
					]
				],
			})

			let resData = successResponse
			resData.data = result
			res.json(resData)
		} catch (error) {
			logger.error(e.message)
			throw new Error(500)
		}
	}
)

router.post("/",
	async (req, res) => {
		let { pageIndex, pageSize, endDate, startDate, keyword } = req.body
		let offset = (pageIndex - 1) * pageSize

		if (pageIndex <= 0) offset = 0
		try {
			const conditions = {
				[Op.or]: {
					title: {
						[Op.like]: `%${keyword}%`
					},
					web_url: {
						[Op.like]: `%${keyword}%`
					}
				}
			}
			if (startDate && endDate) conditions.createdAt = {
				[Op.between]: [startDate, endDate],
			}
			const result = await TechNews.findAll({
				where: conditions,
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