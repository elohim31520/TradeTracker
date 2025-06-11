const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { verifyToken } = require('../middleware/auth')
const { verifyAdmin } = require('../middleware/adminAuth')
const validate = require('../middleware/validate')
const { createAdminSchema, deleteUserSchema } = require('../schemas/adminSchema')

// 所有路由都需要先驗證 token 和管理員權限
router.use(verifyToken, verifyAdmin)

// 獲取所有用戶
router.get('/users', adminController.getAllUsers)

// 設置用戶為管理員
router.post('/set-admin', validate(createAdminSchema), adminController.setUserAsAdmin)

// 移除管理員權限
router.delete('/admin/:userId', validate(deleteUserSchema, 'params'), adminController.removeAdmin)

// 刪除用戶
router.delete('/user/:userId', validate(deleteUserSchema, 'params'), adminController.deleteUser)

// 獲取系統統計信息
router.get('/stats', adminController.getSystemStats)

module.exports = router
