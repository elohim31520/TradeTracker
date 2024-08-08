import { Request, Response, NextFunction } from 'express'
import portfolioService from '../services/portfolioService'
const userService = require('../services/userService')
import _ from 'lodash'

class PorfolioController {
	async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user_name: string = _.get(req, 'decoded.user_name', '')
			const user = await userService.getByName(user_name)
			const user_id: number = user.id
			const transactions = await portfolioService.getByUserId(user_id)
			res.status(200).json(transactions)
		} catch (error: any) {
			next(error)
		}
	}
}

export default new PorfolioController()
