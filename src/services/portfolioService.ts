const db = require('../../models')
import { getZonedDate } from '../modules/date'
import { Portfolio, PortfolioResponse } from '../types/portfolio'

interface updateParams {
	company_id?: number
	quantity?: number
	average_price?: number
}

class PortfolioService {
	async getById(id: number): Promise<Portfolio | null> {
		return db.Portfolio.findByPk(id)
	}

	async getAllByUserId(userId: number): Promise<PortfolioResponse[]> {
		const portfolios = await db.Portfolio.findAll({
			where: {
				user_id: userId,
			},
			attributes: ['id', 'company_id', 'quantity', ['average_price', 'avg']],
			raw: true,
			include: [
				{
					model: db.Company,
					as: 'company',
					attributes: ['name', 'symbol'],
					required: false,
				},
			],
			nest: true,
		})
		return portfolios.map(({ company, ...rest }: any) => ({
			...rest,
			stock_id: company?.symbol || '',
			company: company,
		})) as unknown as PortfolioResponse[]
	}

	async updateByUser(userId: number, data: updateParams): Promise<void> {
		try {
			const now = getZonedDate()

			const [affectedRows] = await db.Portfolio.update(
				{
					...data,
					updatedAt: now,
				},
				{
					where: {
						user_id: userId,
						company_id: data?.company_id,
					},
				}
			)

			if (affectedRows === 0) {
				throw new Error(`Portfolio not found for userId: ${userId} and company_id ${data.company_id}`)
			}

			return
		} catch (error: any) {
			throw new Error(error)
		}
	}

	async deleteByUser(userId: number, portfolioId: number): Promise<void> {
		return db.Portfolio.destroy({
			where: {
				user_id: userId,
				id: portfolioId,
			},
		})
	}

	async createByUser(userId: number, data: updateParams): Promise<void> {
		return db.Portfolio.create({
			user_id: userId,
			...data,
		})
	}
}

export default new PortfolioService()
