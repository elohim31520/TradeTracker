const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const marketController = require('../controllers/marketIndexController')
const validate = require('../middleware/validate')
const { getLastOneSchema, getByDaysSchema } = require('../schemas/marketIndexSchema')
const redisCache = require('../middleware/redisCache')
const conditionalCache = require('../middleware/conditionalCache')
const { DAILY_UPDATE_CACHE_TTL } = require('../constant/cache')

// 不需要驗證的路由
router.get('/', marketController.getAll)
router.get('/last/:symbol', validate(getLastOneSchema, 'params'), marketController.getLstOne)
router.get('/stock/winners',redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockWinners)
router.get('/stock/losers',redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockLosers)

// 設置驗證中間件
router.use(verifyToken)

// 需要驗證但不需要快取的路由
router.get('/momentum', marketController.getMomentum)

const momentumRangeCacheCondition = req => {
	const days = parseInt(req.params.days, 10)
	return [7, 30, 60].includes(days)
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
router.get('/stock/symbols', marketController.getStockSymbol)
router.get('/stock/breadth', marketController.getMarketBreadth)

module.exports = router
