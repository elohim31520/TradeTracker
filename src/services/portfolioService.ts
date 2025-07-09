const db = require('../../models')
import { getZonedDate } from '../modules/date'

interface updateParams {
	stock_id?: string
	quantity?: number
	average_price?: number
}

class PortfolioService {
	async getById(id: number) {
		return db.Portfolio.findByPk(id)
	}

	async getAllByUserId(userId: string) {
		return db.Portfolio.findAll({
			where: {
				user_id: userId,
			},
			include: [
				{
					model: db.Company,
					as: 'Company',
					attributes: ['name', 'symbol'],
					required: false,
				},
			],
			nest: true,
		})
	}

	async updateByUser(userId: string, data: updateParams): Promise<void> {
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
}

export default new PortfolioService()
