import userService from '../services/userService'
import { success } from '../modules/responseHelper'
import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'

interface AuthenticatedRequest extends Request {
	user?: {
		id: number
	}
}

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

	async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		try {
			const userId = _.get(req, 'user.id')
			if (_.isUndefined(userId)) {
				throw new Error('User ID is required')
			}
			const { oldPassword, newPassword } = req.body
			const result = await userService.changePassword({ userId, oldPassword, newPassword })
			res.json(success(result))
		} catch (error) {
			next(error)
		}
	}
}

export default new UserController()
