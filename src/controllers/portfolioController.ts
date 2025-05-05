import { Request, Response, NextFunction } from 'express'
import portfolioService from '../services/portfolioService'
import _ from 'lodash'
const { getUserNameFromReq } = require('../js/util')

class PorfolioController {
	async getAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userName: string = getUserNameFromReq(req)
			const transactions = await portfolioService.getAllByUserId(userName)
			res.status(200).json(transactions)
		} catch (error: any) {
			next(error)
		}
	}

	async updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userName: string = getUserNameFromReq(req)
			const data = _.get(req, 'body', {})
			await portfolioService.updateByUser(userName, data)
			res.status(200).json({ success: true })
		} catch (error: any) {
			console.log(error)
			next(error)
		}
	}
}

export default new PorfolioController()
