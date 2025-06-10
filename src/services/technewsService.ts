import { Op } from 'sequelize'
const db = require('../../models')

interface techNewsAttributes {
	id: number
	title: string
	release_time: string
	publisher: string
	web_url: string
	createdAt: Date
	updatedAt: Date
}

interface searchAttributes {
	keyword?: string
	page: number
	size: number
}

class TechnewsService {
	async getById(id: number): Promise<techNewsAttributes | null> {
		return db.tech_investment_news.findByPk(id)
	}

	async getAll({ keyword, page, size }: searchAttributes): Promise<techNewsAttributes[] | null> {
		const offset = (page - 1) * size
		const query = keyword
			? {
					where: {
						title: {
							[Op.like]: `%${keyword}%`,
						},
					},
			  }
			: {}
		return db.tech_investment_news.findAll({
			limit: size,
			offset,
			...query,
			order: [['createdAt', 'DESC']],
		})
	}
}

module.exports = new TechnewsService()
