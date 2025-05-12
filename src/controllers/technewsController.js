const technewsService = require('../services/technewsService')
const _ = require('lodash')
const responseHelper = require('../js/responseHelper')

class technewsController {
	async getById(req, res, next) {
		try {
			const id = req.params.id
			const news = await technewsService.getById(id)
			res.status(200).json(responseHelper.success([news]))
		} catch (error) {
			next(error)
		}
	}

	async getAll(req, res, next) {
		try {
			const page = Number(req.query.page)
			const size = Number(req.query.size)
			const news = await technewsService.getAll(page, size)
			res.status(200).json(responseHelper.success(news.reverse()))
		} catch (error) {
			next(error)
		}
	}

	async searchByKeyword(req, res, next) {
		try {
			const keyword = _.get(req, 'query.keyword', '')
			const news = await technewsService.searchByKeyword(keyword)
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new technewsController()
