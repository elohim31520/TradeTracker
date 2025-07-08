const db = require('../../models')

class TransactionService {
	async create(data) {
		return db.Transaction.create(data)
	}

	async getAll(userId) {
		return db.Transaction.findAll({
			where: {
				user_id: userId,
			},
		})
	}

	async getById(id) {
		return db.Transaction.findByPk(id)
	}

	async update(id, data) {
		const transaction = await db.Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		return transaction.update(data)
	}

	async delete(id) {
		const transaction = await db.Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		return transaction.destroy()
	}
}

module.exports = new TransactionService()
