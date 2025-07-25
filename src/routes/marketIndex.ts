import express from 'express'
import { verifyToken } from '../middleware/auth'
import marketController from '../controllers/marketIndexController'
import validate from '../middleware/validate'
import { getLastOneSchema, getByDaysSchema } from '../schemas/marketIndexSchema'
import redisCache from '../middleware/redisCache'
import conditionalCache from '../middleware/conditionalCache'
import { DAILY_UPDATE_CACHE_TTL } from '../constant/cache'

const router = express.Router()

// 不需要驗證的路由
router.get('/', marketController.getAll)
router.get('/last/:symbol', validate(getLastOneSchema, 'params'), marketController.getLstOne)
router.get('/stock/winners', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockWinners)
router.get('/stock/losers', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockLosers)
router.get('/stock/symbols', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockSymbol)
router.get('/stock/breadth', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getMarketBreadth)
router.get('/:symbol', marketController.getMarketDataBySymbol)


// 設置驗證中間件
router.use(verifyToken)

// 需要驗證但不需要快取的路由
router.get('/momentum', marketController.getMomentum)

const momentumRangeCacheCondition = (req: express.Request) => {
	const days = parseInt(req.params.days, 10)
	return [3, 7, 30, 60].includes(days)
}

router.get(
	'/momentum/range/:days',
	validate(getByDaysSchema, 'params'),
	conditionalCache(DAILY_UPDATE_CACHE_TTL, momentumRangeCacheCondition),
	marketController.getMarketIndicesByDays
)

// 設置快取中間件
router.use(redisCache(DAILY_UPDATE_CACHE_TTL))

// 需要驗證和快取的路由
router.get('/weights', marketController.getWeights)
router.get('/stock/prices', marketController.getStockPrices)

export default router 