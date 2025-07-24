import transactionService from '../services/transactionService'
import { success, fail } from '../modules/responseHelper'
import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'

class TransactionController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id') as unknown as number
			req.body.user_id = userId
			const transaction = await transactionService.create(req.body)
			res.status(201).json(success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id') as unknown as number
			const transactions = await transactionService.getAll(userId)
			res.status(200).json(success(transactions))
		} catch (error) {
			next(error)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const transactionId = Number(_.get(req, 'params.id'))
			if (!transactionId) {
				res.status(400).json(fail(400, 'Transaction ID is required'))
			}
			const transaction = await transactionService.getById(transactionId)
			res.status(200).json(success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const transactionId = Number(_.get(req, 'params.id'))
			if (!transactionId) {
				res.status(400).json(fail(400, 'Transaction ID is required'))
			}
			const transaction = await transactionService.update(transactionId, req.body)
			res.status(200).json(success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const transactionId = Number(_.get(req, 'params.id'))
			if (!transactionId) {
				res.status(400).json(fail(400, 'Transaction ID is required'))
			}
			await transactionService.delete(transactionId)
			res.status(204).json(success([], 'Transaction deleted successfully'))
		} catch (error) {
			next(error)
		}
	}
}

export default new TransactionController()
