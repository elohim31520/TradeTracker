const technewsService = require('../services/technewsService')
const _ = require('lodash')
const { ClientError } = require('../js/errors')
const responseHelper = require('../js/responseHelper')

class technewsController {
	async getById(req, res, next) {
		try {
			const id = req.params.id

			if (!id || id === 'undefined') {
				throw new ClientError('Missing or invalid id parameter')
			}
			const news = await technewsService.getById(id)
			res.status(200).json(responseHelper.success([news]))
		} catch (error) {
			next(error)
		}
	}

	async getAll(req, res, next) {
		try {
			const page = parseInt(req.query.page, 10) || 1
			const size = parseInt(req.query.size, 10) || 10

			if (page <= 0 || size <= 0) {
				throw new ClientError(`Invalid request parameters! Page: ${page}, Size: ${size}`)
			}
			const news = await technewsService.getAll(page, size)
			res.status(200).json(responseHelper.success(news.reverse()))
		} catch (error) {
			next(error)
		}
	}

	async searchByKeyword(req, res, next) {
		try {
			const keyword = _.get(req, 'query.keyword', '')
			if (!keyword) {
				throw new ClientError('Keyword query parameter is required')
			}
			const news = await technewsService.searchByKeyword(keyword)
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new technewsController()
