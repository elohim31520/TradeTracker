import models from '../../models'
import { TransactionAttributes, TransactionCreationAttributes } from '../types/transaction'
import { DB, TransactionInstance } from '../types/db'
import { ClientError } from '../modules/errors'

const db = models as unknown as DB

interface GetAllParams {
	userId: number
	page: number
	size: number
}

class TransactionService {
	async create(data: TransactionCreationAttributes): Promise<TransactionAttributes> {
		const transaction = await db.Transaction.create(data)
		return transaction.get({ plain: true })
	}

	async getAll({ userId, page, size }: GetAllParams): Promise<TransactionAttributes[]> {
		const transactions = await db.Transaction.findAll({
			where: {
				user_id: userId,
			},
			offset: (page - 1) * size,
			order: [['createdAt', 'DESC']],
			limit: size,
			raw: true,
		})
		return transactions
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
		const deletedRowCount = await db.Transaction.destroy({
			where: {
				id,
			},
		})

		if (deletedRowCount === 0) {
			// 如果沒有任何行被刪除，也拋出錯誤
			throw new ClientError('找不到交易紀錄，或紀錄已被刪除')
		}
	}
}

export default new TransactionService()
