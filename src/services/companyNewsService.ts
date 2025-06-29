const db = require('../../models')
const _ = require('lodash')
import { Op } from 'sequelize'

interface CompanyNewsAttributes {
	title: string
	symbol: string
	release_time?: Date
	publisher?: string
	web_url?: string
	company_id?: number
	companyName?: string
}

interface searchParams {
	page: number
	size: number
	keyword?: string
}

class companyNewsService {
	async bulkCreate(params: CompanyNewsAttributes[]): Promise<void> {
		try {
			for (const param of params) {
				const company = await db.Company.findOne({
					where: {
						symbol: param.symbol,
					},
				})
				if (!company) {
					throw new Error(`Company with symbol ${param.symbol} not found`)
				}
				param.company_id = company.id
			}
			await db.CompanyNews.bulkCreate(params)
		} catch (error: any) {
			throw new Error(error)
		}
	}

	async create(params: CompanyNewsAttributes): Promise<void> {
		try {
			const company = await db.Company.findOne({
				where: {
					symbol: params.symbol,
				},
			})
			if (!company) {
				throw new Error(`Company with symbol ${params.symbol} not found`)
			}
			params.company_id = company.id
			await db.CompanyNews.create(params)
		} catch (error: any) {
			throw new Error(error)
		}
	}

	async getAll({ page, size, keyword }: searchParams): Promise<CompanyNewsAttributes[]> {
		try {
			const offset = (page - 1) * size
			const where = keyword
				? {
						where: {
							title: {
								[Op.like]: `%${keyword}%`,
							},
						},
				  }
				: {}
			const news = await db.CompanyNews.findAll({
				limit: size,
				offset,
				order: [['createdAt', 'DESC']],
				...where,
				include: [
					{
						model: db.Company,
						as: 'Company',
						attributes: ['name'],
						required: false,
					},
				],
				raw: true,
				nest: true,
			})
			return news
		} catch (error: any) {
			throw new Error(error)
		}
	}
}

export default new companyNewsService()
