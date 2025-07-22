import models from '../../models'
import { TransactionAttributes, TransactionCreationAttributes } from '../types/transaction'
import { Db, TransactionInstance } from '../types/db'

const db = models as unknown as Db

class TransactionService {
	async create(data: TransactionCreationAttributes): Promise<TransactionAttributes> {
		const transaction = await db.Transaction.create(data)
		return transaction.get({ plain: true })
	}

	async getAll(userId: number): Promise<TransactionAttributes[]> {
		const transactions = await db.Transaction.findAll({
			where: {
				user_id: userId,
			},
		})
		return transactions.map((t: TransactionInstance) => t.get({ plain: true }))
	}

	async getById(id: number): Promise<TransactionAttributes | null> {
		const transaction = await db.Transaction.findByPk(id)
		return transaction ? transaction.get({ plain: true }) : null
	}

	async update(id: number, data: Partial<TransactionCreationAttributes>): Promise<TransactionAttributes> {
		const transaction = await db.Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		const updatedTransaction = await transaction.update(data)
		return updatedTransaction.get({ plain: true })
	}

	async delete(id: number): Promise<void> {
		const transaction = await db.Transaction.findByPk(id)
		if (!transaction) {
			throw new Error('Transaction not found')
		}
		await transaction.destroy()
	}
}

export default new TransactionService() 