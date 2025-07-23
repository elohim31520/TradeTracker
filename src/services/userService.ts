import db from '../../models'
import type { DB } from '../types/db'
import { generateToken, generateSalt, sha256 } from '../modules/crypto'
import { ClientError } from '../modules/errors'

const typedDB = db as unknown as DB

interface User {
	name: string
	pwd: string
	email: string
}

class userService {
	async getByName(username: string) {
		return typedDB.Users.findOne({ where: { name: username } })
	}

	async create({ name, pwd, email }: User) {
		let salt = generateSalt(),
			hashed = sha256(pwd, salt)

		await typedDB.Users.create({
			name,
			pwd: hashed,
			salt,
			email,
		})

		return generateToken({ name })
	}

	async login({ name, pwd }: { name: string; pwd: string }) {
		const user = await typedDB.Users.findOne({ where: { name }, raw: true })
		if (!user) throw new ClientError('User not found')

		const { salt, pwd: storeHash } = user
		const currentHash = sha256(pwd, salt || '')
		if (currentHash != storeHash) throw new ClientError('Password Is Incorrect')
		return generateToken({ name })
	}
}

export default new userService()
