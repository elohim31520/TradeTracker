const { Transaction } = require('../models')

class TransactionService {
	async create(data) {
		return Transaction.create(data)
	}

	async getAll() {
		return Transaction.findAll()
	}

	async getById(id) {
		return Transaction.findByPk(id)
	}

	async update(id, data) {
		const transaction = await Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		return transaction.update(data)
	}

	async delete(id) {
		const transaction = await Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		return transaction.destroy()
	}
}

module.exports = new TransactionService()
