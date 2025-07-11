import models from '../../models'
import type { DB } from '../types/db'
import type { Admin, User, UserWithAdmin } from '../types/user'

const db = models as unknown as DB

class AdminService {
	/**
	 * 獲取所有用戶列表
	 * @returns {Promise<Array>} 用戶列表
	 */
	async getAllUsers(): Promise<User[]> {
		const users = await db.Users.findAll({
			include: [
				{
					model: db.Admin,
					as: 'admin',
					attributes: ['id', 'userId'],
				},
			],
			nest: true,
			raw: true,
		}) as unknown as UserWithAdmin[]

		return users.map((user) => {
			if (user.admin && user.admin.id === null && user.admin.userId === null) {
				const { admin, ...rest } = user
				return rest
			} else {
				return { ...user, isAdmin: true }
			}
		})
	}

	/**
	 * 將用戶設置為管理員
	 * @param {Number} userId - 用戶ID
	 * @returns {Promise<Object>} 創建的管理員記錄
	 */
	async setUserAsAdmin(userId: number): Promise<Admin> {
		const user = await db.Users.findByPk(userId)
		if (!user) {
			throw new Error('用戶不存在')
		}

		const existingAdmin = await db.Admin.findOne({ where: { userId } })
		if (existingAdmin) {
			throw new Error('該用戶已經是管理員')
		}

		return db.Admin.create({ userId })
	}

	/**
	 * 移除管理員權限
	 * @param {Number} userId - 用戶ID
	 * @returns {Promise<Boolean>} 操作結果
	 */
	async removeAdmin(userId: number): Promise<boolean> {
		const admin = await db.Admin.findOne({ where: { userId } })
		if (!admin) {
			throw new Error('該用戶不是管理員')
		}

		await admin.destroy()
		return true
	}

	/**
	 * 刪除用戶
	 * @param {Number} userId - 用戶ID
	 * @returns {Promise<Boolean>} 操作結果
	 */
	async deleteUser(userId: number): Promise<boolean> {
		const user = await db.Users.findByPk(userId)
		if (!user) {
			throw new Error('用戶不存在')
		}

		await user.destroy()
		return true
	}

	/**
	 * 獲取系統統計信息
	 * @returns {Promise<Object>} 統計信息
	 */
	async getSystemStats(): Promise<{ userCount: number; adminCount: number }> {
		const [userCount, adminCount] = await Promise.all([db.Users.count(), db.Admin.count()])

		return {
			userCount,
			adminCount,
		}
	}
}

export default new AdminService()
