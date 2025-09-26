const db = require('../../models')
import { getZonedDate } from '../modules/date'
import { Portfolio, PortfolioWithAvg } from '../types/portfolio'

interface updateParams {
	stock_id?: string
	quantity?: number
	average_price?: number
}

class PortfolioService {
	async getById(id: number): Promise<Portfolio | null> {
		return db.Portfolio.findByPk(id)
	}

	async getAllByUserId(userId: number): Promise<PortfolioWithAvg[]> {
		const portfolios = await db.Portfolio.findAll({
			where: {
				user_id: userId,
			},
			attributes: ['id', 'stock_id', 'quantity', ['average_price', 'avg']],
			raw: true,
			// 不關聯db.Company 為了省雲端網路留流量！
			// include: [
			// 	{
			// 		model: db.Company,
			// 		as: 'company',
			// 		attributes: ['name', 'symbol'],
			// 		required: false,
			// 	},
			// ],
			// nest: true,
		})
		return portfolios as unknown as PortfolioWithAvg[]
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
						stock_id: data?.stock_id,
					},
				}
			)

			if (affectedRows === 0) {
				throw new Error(`Portfolio not found for userId: ${userId} and stock_id ${data.stock_id}`)
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
