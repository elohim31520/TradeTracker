import express, { Router } from 'express'
import statementController from '../controllers/statementController'
import validate from '../middleware/validate'
import { getBySymbolSchema, getBySymbolWithDaysSchema } from '../schemas/statementSchema'

const router: Router = express.Router()

router.get(
	'/:symbol',
	validate(getBySymbolSchema, 'params'),
	validate(getBySymbolWithDaysSchema, 'query'),
	statementController.getBySymbol
)

export default router 