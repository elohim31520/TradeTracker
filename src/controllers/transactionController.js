const transactionService = require('../services/transactionService')
const userService = require('../services/userService')
const _ = require('lodash')

class TransactionController {
	async create(req, res, next) {
		try {
			const user_name = _.get(req, 'decoded.user_name', '')
			const user = await userService.getByName(user_name)
			req.body.user_id = user.id
			const transaction = await transactionService.create(req.body)
			res.status(201).json(transaction)
		} catch (error) {
			next(error)
		}
	}

	async getAll(req, res, next) {
		try {
			const transactions = await transactionService.getAll()
			res.status(200).json(transactions)
		} catch (error) {
			next(error)
		}
	}

	async getById(req, res, next) {
		try {
			const transaction = await transactionService.getById(req.params.id)
			if (!transaction) {
				res.status(404).json({ error: 'Transaction not found' })
			} else {
				res.status(200).json(transaction)
			}
		} catch (error) {
			next(error)
		}
	}

	async update(req, res, next) {
		try {
			const transaction = await transactionService.update(req.params.id, req.body)
			res.status(200).json(transaction)
		} catch (error) {
			next(error)
		}
	}

	async delete(req, res, next) {
		try {
			await transactionService.delete(req.params.id)
			res.status(204).end()
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new TransactionController()
