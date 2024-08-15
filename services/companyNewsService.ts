const db = require('../models')

interface CompanyNewsAttributes {
	title: string
	symbol: string
	release_time?: Date
	publisher?: string
	web_url?: string
	company_id?: number
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
}

export default new companyNewsService()
