const userService = require('../services/userService')
const responseHelper = require('../js/responseHelper')

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
			res.status(200).json(responseHelper.success(result))
		} catch (error) {
			console.log(error)
			next(error)
		}
	}
}

module.exports = new UserController()
