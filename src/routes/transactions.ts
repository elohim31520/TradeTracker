import express from 'express'
import transactionController from '../controllers/transactionController'
import { verifyToken } from '../middleware/auth'
import { userContext } from '../middleware/userContext'
import validate from '../middleware/validate'
import { createSchema, getAllSchema, bulkCreateSchema } from '../schemas/transactionSchema'

const router = express.Router()

// 所有交易相關的路由都需要驗證 token 和用戶上下文
router.use(verifyToken, userContext)

router.post('/', validate(createSchema), transactionController.create)
router.post('/bulkCreate', validate(bulkCreateSchema), transactionController.bulkCreate)
router.get('/', validate(getAllSchema, 'query'), transactionController.getAll)
router.get('/:id', transactionController.getById)
router.put('/:id', transactionController.update)
router.delete('/:id', transactionController.delete)

export default router 