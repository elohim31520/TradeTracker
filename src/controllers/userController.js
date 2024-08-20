const userService = require('../services/userService')
const logger = require('../logger')

class UserController {
	async create(req, res, next) {
		try {
			const result = await userService.create(req.body)
			res.status(201).json(result)
		} catch (error) {
			logger.error(error.message)
			next(error)
		}
	}

	async login(req, res, next) {
		try {
			const result = await userService.login(req.body)
			res.status(200).json(result)
		} catch (error) {
			logger.error(error.message)
			next(error)
		}
	}
}

module.exports = new UserController()
