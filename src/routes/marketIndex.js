const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const marketController = require('../controllers/marketIndexController')
const validate = require('../middleware/validate')
const { getLastOneSchema, getByDaysSchema } = require('../schemas/marketIndexSchema')
const redisCache = require('../middleware/redisCache')
const conditionalCache = require('../middleware/conditionalCache')
const { CACHE_24H } = require('../constant/cache')

// 不需要驗證的路由
router.get('/', marketController.getAll)
router.get('/last/:symbol', validate(getLastOneSchema, 'params'), marketController.getLstOne)
router.get('/stock/winners',redisCache(CACHE_24H), marketController.getStockWinners)
router.get('/stock/losers',redisCache(CACHE_24H), marketController.getStockLosers)

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
	conditionalCache(CACHE_24H, momentumRangeCacheCondition),
	marketController.getMarketIndicesByDays
)

// 設置快取中間件
router.use(redisCache(CACHE_24H))

// 需要驗證和快取的路由
router.get('/weights', marketController.getWeights)
router.get('/stock/prices', marketController.getStockPrices)
router.get('/stock/symbols', marketController.getStockSymbol)
router.get('/stock/breadth', marketController.getMarketBreadth)

module.exports = router
