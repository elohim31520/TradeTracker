const { Users } = require('../../models')
const { generateToken, generateSalt, sha256 } = require('../js/crypto')
const { ClientError } = require('../js/errors')
const logger = require('../logger')

class userService {
	async getByName(user_name) {
		return Users.findOne({ where: { user_name } })
	}

	async create({ user_name, pwd, email }) {
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
			if (e.name === 'SequelizeUniqueConstraintError') {
				throw new ClientError('用户或邮箱已存在, user name or email is duplicated')
			}

			logger.error(e.message)
			throw e
		}
	}

	async login({ user_name, pwd }) {
		try {
			const user = await Users.findOne({ where: { user_name } })
			const { salt, pwd: storeHash } = user.dataValues
			if (!user) throw new ClientError('User not found')

			const currentHash = sha256(pwd, salt)
			if (currentHash != storeHash) throw new ClientError('Password Is Incorrect')
			return { code: 1, token: generateToken({ user_name }) }
		} catch (err) {
			logger.error(err.message)
			throw err
		}
	}
}

module.exports = new userService()
