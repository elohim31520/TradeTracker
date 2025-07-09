const technewsService = require('../services/technewsService')
const _ = require('lodash')
const responseHelper = require('../modules/responseHelper')

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
			const keyword = _.get(req, 'query.keyword', '')
			const page = +_.get(req, 'query.page')
			const size = +_.get(req, 'query.size')
			const news = await technewsService.getAll({ keyword, page, size })
			res.json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new technewsController()
