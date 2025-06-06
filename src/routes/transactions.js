const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { verifyToken } = require('../middleware/auth')
const { userContext } = require('../middleware/userContext')
const validate = require('../middleware/validate')
const { createSchema } = require('../schemas/transactionSchema')
const { verifyAdmin } = require('../middleware/adminAuth')

// 所有交易相關的路由都需要驗證 token 和用戶上下文
router.use(verifyToken, userContext)

router.post('/', validate(createSchema), transactionController.create)
router.get('/', transactionController.getAll)
router.get('/:id', transactionController.getById)
router.put('/:id', transactionController.update)
router.delete('/:id', verifyAdmin, transactionController.delete)

module.exports = router
