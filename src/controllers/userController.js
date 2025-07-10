const userService = require('../services/userService').default
const responseHelper = require('../modules/responseHelper')

class UserController {
	async create(req, res, next) {
		try {
			const result = await userService.create(req.body)
			res.status(201).json(responseHelper.success(result))
		} catch (error) {
			next(error)
		}
	}

	async login(req, res, next) {
		try {
			const result = await userService.login(req.body)
			res.json(responseHelper.success(result))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new UserController()
