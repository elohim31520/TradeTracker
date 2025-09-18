import { generateToken, generateSalt, sha256 } from '../modules/crypto'
import { ClientError } from '../modules/errors'
import { USER_NOT_FOUND, PASSWORD_INCORRECT } from '../constant/userErrors'
const db = require('../../models')

interface User {
	name: string
	pwd: string
	email: string
}

class userService {
	async getByName(username: string) {
		return db.Users.findOne({ where: { name: username } })
	}

	async create({ name, pwd, email }: User) {
		let salt = generateSalt(),
			hashed = sha256(pwd, salt)

		await db.Users.create({
			name,
			pwd: hashed,
			salt,
			email,
		})

		return generateToken({ name })
	}

	async login({ name, pwd }: { name: string; pwd: string }) {
		const user = await db.Users.findOne({ where: { name }, raw: true })
		if (!user) throw new ClientError(USER_NOT_FOUND)

		const { salt, pwd: storeHash } = user
		const currentHash = sha256(pwd, salt || '')
		if (currentHash != storeHash) throw new ClientError(PASSWORD_INCORRECT)
		return generateToken({ name })
	}

	async changePassword({
		userId,
		oldPassword,
		newPassword,
	}: {
		userId: number
		oldPassword: string
		newPassword: string
	}) {
		const user = await db.Users.findOne({ where: { id: userId } as any, raw: true })
		if (!user) throw new ClientError(USER_NOT_FOUND)

		const { salt, pwd: storeHash } = user
		const currentHash = sha256(oldPassword, salt || '')
		if (currentHash != storeHash) throw new ClientError(PASSWORD_INCORRECT)

		const newSalt = generateSalt()
		const newHash = sha256(newPassword, newSalt)

		await db.Users.update({ pwd: newHash, salt: newSalt }, { where: { id: userId } as any })
		return { message: '密碼更新成功' }
	}
}

export default new userService()
