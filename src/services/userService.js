const { Users } = require('../../models')
const { generateToken, generateSalt, sha256 } = require('../modules/crypto')
const { ClientError } = require('../modules/errors')

class userService {
	async getByName(user_name) {
		return Users.findOne({ where: { user_name } })
	}

	async create({ user_name, pwd, email }) {
		let salt = generateSalt(),
			hashed = sha256(pwd, salt)

		await Users.create({
			user_name,
			pwd: hashed,
			salt,
			email,
		})

		return generateToken({ user_name })
	}

	async login({ user_name, pwd }) {
		const user = await Users.findOne({ where: { user_name }, raw: true })
		const { salt, pwd: storeHash } = user
		if (!user) throw new ClientError('User not found')

		const currentHash = sha256(pwd, salt)
		if (currentHash != storeHash) throw new ClientError('Password Is Incorrect')
		return generateToken({ user_name })
	}
}

module.exports = new userService()
