import express, { Router } from 'express'
import portfolioController from '../controllers/portfolioController'
import { verifyToken } from '../middleware/auth'
import validate from '../middleware/validate'
import { updateSchema, deleteSchema } from '../schemas/portfolioSchema'
import { userContext } from '../middleware/userContext'

const router: Router = express.Router()

router.get('/', verifyToken, userContext, portfolioController.getAllByUserId)
router.post('/', verifyToken, userContext, validate(updateSchema), portfolioController.updatePortfolio)
router.delete('/:id', verifyToken, userContext, validate(deleteSchema, 'params'), portfolioController.deletePortfolio)

export default router
