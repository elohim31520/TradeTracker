import { Request, Response, NextFunction } from 'express'
import portfolioService from '../services/portfolioService'
import _ from 'lodash'
const responseHelper = require('../js/responseHelper')
const { getUserNameFromReq } = require('../js/util')

class PorfolioController {
	async getAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userName: string = getUserNameFromReq(req)
			const transactions = await portfolioService.getAllByUserId(userName)
			res.json(responseHelper.success(transactions))
		} catch (error: any) {
			next(error)
		}
	}

	async updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userName: string = getUserNameFromReq(req)
			const data = _.get(req, 'body', {})
			await portfolioService.updateByUser(userName, data)
			res.json(responseHelper.success())
		} catch (error: any) {
			next(error)
		}
	}
}

export default new PorfolioController()
