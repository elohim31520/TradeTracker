const TechNews = require('../models/techNews')

class TechnewsService {
	async getById(id) {
		return TechNews.findByPk(id)
	}

	async getAll(page = 1, size = 10) {
		page = Math.max(parseInt(page, 10), 1)
		size = Math.max(parseInt(size, 10), 1)

		const offset = (page - 1) * size
		return TechNews.findAll({
			limit: size,
			offset,
			order: [['createdAt', 'DESC']],
		})
	}
}

module.exports = new TechnewsService()
