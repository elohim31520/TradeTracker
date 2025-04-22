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

class TechnewsService {
	async getById(id: number): Promise<techNewsAttributes | null> {
		return db.tech_investment_news.findByPk(id)
	}

	async getAll(page: number, size: number): Promise<techNewsAttributes[]> {
		const offset = (page - 1) * size
		return db.tech_investment_news.findAll({
			limit: size,
			offset,
			order: [['createdAt', 'DESC']],
		})
	}

	async searchByKeyword(keyword: string): Promise<techNewsAttributes[] | null> {
		return db.tech_investment_news.findAll({
			where: {
				title: {
					[Op.like]: `%${keyword}%`,
				},
			},
		})
	}
}

module.exports = new TechnewsService()
