import dayjs from 'dayjs'

const db = require('../../models')

interface updateParams {
	stock_id?: string
	quantity?: number
	average_price?: number
}

class PortfolioService {
	async getById(id: number) {
		return db.Portfolio.findByPk(id)
	}

	async getByUserId(userId: number) {
		return db.Portfolio.findAll({
			where: {
				user_id: userId,
			},
		})
	}

	async updateByUser(userName: string, data: updateParams): Promise<void> {
		try {
			const user = await db.Users.findOne({ where: { user_name: userName } })
			if (!user) {
				throw new Error(`User with username "${userName}" not found.`)
			}

			const userId = user.id
			const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

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
				throw new Error(`Portfolio not found for userName ${userName} and stock_id ${data.stock_id}`);
			}

			return
		} catch (error: any) {
			throw new Error(error)
		}
	}
}

export default new PortfolioService()
