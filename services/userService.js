const { Users } = require('../models')

class userService {
	async getByName(user_name) {
		return Users.findOne({ where: { user_name } })
	}
}

module.exports = new userService()
