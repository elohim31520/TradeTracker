const transactionService = require('../services/transactionService')
const userService = require('../services/userService')
const _ = require('lodash')
const responseHelper = require('../js/responseHelper')
const { getUserNameFromReq } = require('../js/util')

class TransactionController {
	async create(req, res, next) {
		try {
			const userName = getUserNameFromReq(req)
			const user = await userService.getByName(userName)
			req.body.user_id = user.id
			const transaction = await transactionService.create(req.body)
			res.status(201).json(responseHelper.success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async getAll(req, res, next) {
		try {
			const userName = getUserNameFromReq(req)
			const transactions = await transactionService.getAll(userName)
			res.status(200).json(responseHelper.success(transactions))
		} catch (error) {
			next(error)
		}
	}

	async getById(req, res, next) {
		try {
			const transaction = await transactionService.getById(req.params.id)
			res.status(200).json(responseHelper.success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async update(req, res, next) {
		try {
			const transaction = await transactionService.update(req.params.id, req.body)
			res.status(200).json(responseHelper.success(transaction))
		} catch (error) {
			next(error)
		}
	}

	async delete(req, res, next) {
		try {
			await transactionService.delete(req.params.id)
			res.status(204).json(responseHelper.success([], 'Transaction deleted successfully'))
		} catch (error) {
			next(error)
		}
	}

	async clone(req, res, next) {
		try {
			console.log('clone')
			const transactions = await transactionService.getAll()
			const fs = require('fs')
			const path = require('path')

			const dbFolderPath = path.join(__dirname, '..', 'DB')
			if (!fs.existsSync(dbFolderPath)) {
				fs.mkdirSync(dbFolderPath)
			}

			const filePath = path.join(dbFolderPath, 'transactions.json')
			const dataToWrite = JSON.stringify(transactions, null, 2)

			await fs.promises.writeFile(filePath, dataToWrite, 'utf8')
			res.json(responseHelper.success([], 'Transactions cloned successfully'))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new TransactionController()
