const technewsService = require('../services/technewsService')
const _ = require('lodash')
const { ClientError } = require('../js/errors')

class technewsController {
	async getById(req, res, next) {
		try {
			const id = req.params.id

			if (!id || id === 'undefined') {
				throw new ClientError('Missing or invalid id parameter')
			}
			const news = await technewsService.getById(id)
			res.status(200).json(news)
		} catch (error) {
			next(error)
		}
	}

	async getAll(req, res, next) {
		try {
			const page = _.get(req, 'query.page', 1)
			const size = _.get(req, 'query.size', 10)
			if (typeof page != 'number' || typeof size != 'number') {
				throw new ClientError('request params is wrong!')
			}
			const news = await technewsService.getAll(page, size)
			res.status(200).json(news)
		} catch (error) {
			next(error)
		}
	}

	async searchByKeyword(req, res, next) {
		const keyword = _.get(req, 'query.keyword', '')
		if (!keyword) {
			next(new ClientError('Keyword query parameter is required'))
		}
		const news = await technewsService.searchByKeyword(keyword)
		res.status(200).json(news)
	}
}

module.exports = new technewsController()
