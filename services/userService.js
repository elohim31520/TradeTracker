const { Users } = require('../models')
const { generateToken, generateSalt, sha256 } = require('../js/crypto')

class userService {
	async getByName(user_name) {
		return Users.findOne({ where: { user_name } })
	}

	async create({ user_name, pwd, email }) {
		const dup = await Users.findOne({ where: { user_name } })
		if (dup) throw new Error(409101)

		try {
			let salt = generateSalt(),
				hashed = sha256(pwd, salt)

			await Users.create({
				user_name,
				pwd: hashed,
				salt,
				email,
			})

			return Promise.resolve({ code: 1, token: generateToken({ user_name }) })
		} catch (e) {
			logger.error(e.message)
			throw new Error(500)
		}
	}

	async login({ user_name, pwd }) {
		try {
			const user = await Users.findOne({ where: { user_name } })
			const { salt, pwd: storeHash } = user.dataValues
			if (!user) throw new Error(401100)
	
			const currentHash = sha256(pwd, salt)
			if (currentHash != storeHash) throw new Error(401100)
			return { code: 1, token: generateToken({ user_name }) }
		} catch (e) {
			logger.error(e.message)
			throw new Error(401100)
		}
	}
}

module.exports = new userService()
