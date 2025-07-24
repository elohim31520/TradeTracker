import models from '../../models'
import { TransactionAttributes, TransactionCreationAttributes } from '../types/transaction'
import { DB, TransactionInstance } from '../types/db'
import { ClientError } from '../modules/errors'

const db = models as unknown as DB

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
			throw new ClientError('找不到交易紀錄，請確認id參數')
		}
		const updatedTransaction = await transaction.update(data)
		return updatedTransaction.get({ plain: true })
	}

	async delete(id: number): Promise<void> {
		const transaction = await db.Transaction.findByPk(id)
		if (!transaction) {
			throw new ClientError('找不到交易紀錄，請確認id參數')
		}
		await transaction.destroy()
	}
}

export default new TransactionService() 