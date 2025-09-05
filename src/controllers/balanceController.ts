import { Request, Response, NextFunction } from 'express'
import BalanceService from '../services/balanceService'
import { success } from '../modules/responseHelper'
import _ from 'lodash'

class BalanceController {
	static async getBalance(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id')
			if (_.isUndefined(userId)) {
				throw new Error('User ID is required')
			}
			const data = await BalanceService.getBalance(userId)
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}

	static async createBalance(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id')
			if (_.isUndefined(userId)) {
				throw new Error('User ID is required')
			}
			const data = await BalanceService.createBalance(userId, _.get(req, 'body.balance'))
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}

	static async updateBalance(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id')
			if (_.isUndefined(userId)) {
				throw new Error('User ID is required')
			}
			const data = await BalanceService.updateBalance(userId, _.get(req, 'body.balance'))
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}
}

export default BalanceController
