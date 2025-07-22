import express, { Router } from 'express'
import adminController from '../controllers/adminController'
import { verifyToken } from '../middleware/auth'
import { verifyAdmin } from '../middleware/adminAuth'
import validate from '../middleware/validate'
import * as adminSchema from '../schemas/adminSchema'

const router: Router = express.Router()

// 所有路由都需要先驗證 token 和管理員權限
router.use(verifyToken, verifyAdmin)

// 獲取所有用戶
router.get('/users', adminController.getAllUsers)

// 設置用戶為管理員
router.post('/set-admin', validate(adminSchema.createAdminSchema), adminController.setUserAsAdmin)

// 移除管理員權限
router.delete('/admin/:userId', validate(adminSchema.deleteUserSchema, 'params'), adminController.removeAdmin)

// 刪除用戶
router.delete('/user/:userId', validate(adminSchema.deleteUserSchema, 'params'), adminController.deleteUser)

// 獲取系統統計信息
router.get('/stats', adminController.getSystemStats)

export default router 