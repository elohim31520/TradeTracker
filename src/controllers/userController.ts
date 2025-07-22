import userService from '../services/userService'
import { success } from '../modules/responseHelper'
import { Request, Response, NextFunction } from 'express'

class UserController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await userService.create(req.body)
			res.status(201).json(success(result))
		} catch (error) {
			next(error)
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await userService.login(req.body)
			res.json(success(result))
		} catch (error) {
			next(error)
		}
	}
}

export default new UserController()
