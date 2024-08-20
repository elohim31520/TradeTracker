const db = require('../../models')

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
}

export default new PortfolioService()
