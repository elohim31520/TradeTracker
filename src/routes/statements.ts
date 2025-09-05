import express, { Router } from 'express'
import statementController from '../controllers/statementController'
import validate from '../middleware/validate'
import { getBySymbolSchema, getBySymbolWithDaysSchema } from '../schemas/statementSchema'
const redisCache = require('../middleware/redisCache')
const { DAILY_UPDATE_CACHE_TTL } = require('../constant/cache')

const router: Router = express.Router()

router.get(
	'/:symbol',
	validate(getBySymbolSchema, 'params'),
	validate(getBySymbolWithDaysSchema, 'query'),
	redisCache(DAILY_UPDATE_CACHE_TTL),
	statementController.getBySymbol
)

export default router 