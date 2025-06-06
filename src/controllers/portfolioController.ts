import { Request, Response, NextFunction } from 'express'
import portfolioService from '../services/portfolioService'
import _ from 'lodash'
const responseHelper = require('../js/responseHelper')
const _get = require('lodash/get')

class PorfolioController {
	async getAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = _get(req, 'user.id')
			const transactions = await portfolioService.getAllByUserId(userId)
			res.json(responseHelper.success(transactions))
		} catch (error: any) {
			next(error)
		}
	}

	async updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = _get(req, 'user.id')
			const data = _.get(req, 'body', {})
			await portfolioService.updateByUser(userId, data)
			res.json(responseHelper.success())
		} catch (error: any) {
			next(error)
		}
	}
}

export default new PorfolioController()
