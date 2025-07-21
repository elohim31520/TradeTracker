'use strict'
import { success } from '../modules/responseHelper'
import AdminService from '../services/adminService'
import { Request, Response, NextFunction } from 'express'

class AdminController {
	/**
	 * 獲取所有用戶列表
	 */
	async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const users = await AdminService.getAllUsers()
			res.json(success(users))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 將用戶設置為管理員
	 */
	async setUserAsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.body
			const admin = await AdminService.setUserAsAdmin(userId)
			res.status(201).json(success(admin, '已成功設置為管理員'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 移除管理員權限
	 */
	async removeAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.params
			await AdminService.removeAdmin(userId as unknown as number)
			res.json(success(null, '已成功移除管理員權限'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 刪除用戶
	 */
	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.params
			await AdminService.deleteUser(userId as unknown as number)
			res.json(success(null, '用戶已成功刪除'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 獲取系統統計信息
	 */
	async getSystemStats(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const stats = await AdminService.getSystemStats()
			res.json(success(stats))
		} catch (error) {
			next(error)
		}
	}
}

export default new AdminController()
