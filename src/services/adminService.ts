import models from '../../models'
import type { DB } from '../types/db'
import type { Admin, User, UserWithAdmin } from '../types/user'

const db = models as unknown as DB

class AdminService {
	async getAllUsers(): Promise<User[]> {
		const users = (await db.Users.findAll({
			include: [
				{
					model: db.Admin,
					as: 'admin',
					attributes: ['id', 'userId'],
				},
			],
			attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
			nest: true,
			raw: true,
		})) as unknown as UserWithAdmin[]

		return users.map((user) => {
			if (user.admin && user.admin.id === null && user.admin.userId === null) {
				const { admin, ...rest } = user
				return rest
			} else {
				return { ...user, isAdmin: true }
			}
		})
	}

	async setUserAsAdmin(userId: number): Promise<Admin> {
		const [admin, created] = await db.Admin.findOrCreate({
			where: { userId },
			defaults: { userId }, // 如果是創建，要使用的值
		})

		if (!created) {
			throw new Error('該用戶已經是管理員')
		}

		return admin
	}

	async removeAdmin(userId: number): Promise<boolean> {
		const admin = await db.Admin.findOne({ where: { userId } })
		if (!admin) {
			throw new Error('該用戶不是管理員')
		}

		await admin.destroy()
		return true
	}

	async deleteUser(userId: number): Promise<boolean> {
		const user = await db.Users.findByPk(userId)
		if (!user) {
			throw new Error('用戶不存在')
		}

		await user.destroy()
		return true
	}

	async getSystemStats(): Promise<{ userCount: number; adminCount: number }> {
		const [userCount, adminCount] = await Promise.all([db.Users.count(), db.Admin.count()])

		return {
			userCount,
			adminCount,
		}
	}
}

export default new AdminService()
