'use strict'
const db = require('../../models')
const { Users, Admin } = db

class AdminService {
	/**
	 * 獲取所有用戶列表
	 * @returns {Promise<Array>} 用戶列表
	 */
	async getAllUsers() {
		return Users.findAll({
			include: [
				{
					model: Admin,
					as: 'admin',
					attributes: ['id'],
				},
			],
			nest: true,
			raw: true,
		})
	}

	/**
	 * 將用戶設置為管理員
	 * @param {Number} userId - 用戶ID
	 * @returns {Promise<Object>} 創建的管理員記錄
	 */
	async setUserAsAdmin(userId) {
		const user = await Users.findByPk(userId)
		if (!user) {
			throw new Error('用戶不存在')
		}

		const existingAdmin = await Admin.findOne({ where: { userId } })
		if (existingAdmin) {
			throw new Error('該用戶已經是管理員')
		}

		return Admin.create({ userId })
	}

	/**
	 * 移除管理員權限
	 * @param {Number} userId - 用戶ID
	 * @returns {Promise<Boolean>} 操作結果
	 */
	async removeAdmin(userId) {
		const admin = await Admin.findOne({ where: { userId } })
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
	async deleteUser(userId) {
		const user = await Users.findByPk(userId)
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
	async getSystemStats() {
		const [userCount, adminCount] = await Promise.all([Users.count(), Admin.count()])

		return {
			userCount,
			adminCount,
		}
	}
}

module.exports = new AdminService()
