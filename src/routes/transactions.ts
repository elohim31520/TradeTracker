import express from 'express'
import transactionController from '../controllers/transactionController'
import { verifyToken } from '../middleware/auth'
import { userContext } from '../middleware/userContext'
import validate from '../middleware/validate'
import { createSchema } from '../schemas/transactionSchema'
import { verifyAdmin } from '../middleware/adminAuth'

const router = express.Router()

// 所有交易相關的路由都需要驗證 token 和用戶上下文
router.use(verifyToken, userContext)

router.post('/', validate(createSchema), transactionController.create)
router.get('/', transactionController.getAll)
router.get('/:id', transactionController.getById)
router.put('/:id', transactionController.update)
router.delete('/:id', verifyAdmin, transactionController.delete)

export default router 