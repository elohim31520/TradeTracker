'use strict'
const { success } = require('../js/responseHelper')
const AdminService = require('../services/adminService')

class AdminController {
	/**
	 * 獲取所有用戶列表
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getAllUsers(req, res, next) {
		try {
			const users = await AdminService.getAllUsers()
			return res.json(success(users))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 將用戶設置為管理員
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async setUserAsAdmin(req, res, next) {
		try {
			const { userId } = req.body
			const admin = await AdminService.setUserAsAdmin(userId)
			return res.status(201).json(success(admin, '已成功設置為管理員'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 移除管理員權限
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async removeAdmin(req, res, next) {
		try {
			const { userId } = req.params
			await AdminService.removeAdmin(userId)
			return res.json(success(null, '已成功移除管理員權限'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 刪除用戶
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async deleteUser(req, res, next) {
		try {
			const { userId } = req.params
			await AdminService.deleteUser(userId)
			return res.json(success(null, '用戶已成功刪除'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 獲取系統統計信息
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getSystemStats(req, res, next) {
		try {
			const stats = await AdminService.getSystemStats()
			return res.json(success(stats))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new AdminController()
