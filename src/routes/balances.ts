import { Router } from 'express'
import BalanceController from '../controllers/balanceController'
import { verifyToken } from '../middleware/auth'
import validate from '../middleware/validate'
import { createBalanceSchema, updateBalanceSchema } from '../schemas/balanceSchema'
import { userContext } from '../middleware/userContext'

const router = Router()

router.get('/', verifyToken, userContext, BalanceController.getBalance)
router.post('/', verifyToken, validate(createBalanceSchema), userContext, BalanceController.createBalance)
router.put('/', verifyToken, validate(updateBalanceSchema), userContext, BalanceController.updateBalance)

export default router
