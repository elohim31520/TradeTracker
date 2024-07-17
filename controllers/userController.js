const userService = require('../services/userService')
const logger = require('../logger')

class UserController {
	async create(req, res) {
		try {
			const result = await userService.create(req.body)
			res.status(201).json(result)
		} catch (error) {
			logger.error(error.message)
			res.status(error.message.startsWith('409') ? 409 : 500).json({ error: error.message })
		}
	}

	async login(req, res) {
		try {
			const result = await userService.login(req.body)
			res.status(200).json(result)
		} catch (error) {
			logger.error(error.message)
			res.status(401).json({ error: error.message })
		}
	}
}

module.exports = new UserController()
