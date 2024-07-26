const technewsService = require('../services/technewsService')
const _ = require('lodash')

class technewsController {
	async getById(req, res) {
		try {
			const news = await technewsService.getById(req.params.id)
			res.status(200).json(news)
		} catch (error) {
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	async getAll(req, res) {
		try {
			const page = _.get(req, 'query.page', 1)
			const size = _.get(req, 'query.size', 10)
			const news = await technewsService.getAll(page, size)
			res.status(200).json(news)
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}
}

module.exports = new technewsController()
