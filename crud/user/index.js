const Users = require('../../models/users')
const sequelize = require('../../js/connect')
const { generateToken, md5Encode, generateSalt, sha256 } = require('../../js/crypto')
const logger = require('../../logger')

async function createUser({ user_name, pwd, email }) {
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

async function userLogin({ user_name, pwd }) {
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

module.exports = {
	createUser,
	userLogin,
}
