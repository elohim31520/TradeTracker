const db = require('../../models')

class BalanceService {
	static async getBalance(userId: number) {
		const userBalance = await db.UserBalance.findOne({
			where: {
				user_id: userId,
				currency: 'USD',
			},
			attributes: ['balance'],
			raw: true,
		})

		//TODO: 如果有其他幣種 需要回傳所有幣種的balance，目前沒有
		return userBalance
	}

	static async createBalance(userId: number, balance: number) {
		return await db.UserBalance.create({ user_id: userId, currency: 'USD', balance: balance })
	}

	static async updateBalance(userId: number, balance: number) {
		return await db.UserBalance.update(
			{
				balance,
			},
			{
				where: { user_id: userId, currency: 'USD' },
			}
		)
	}
}

export default BalanceService
