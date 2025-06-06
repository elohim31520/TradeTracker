const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const marketIndexController = require('../controllers/marketIndexController')
const validate = require('../middleware/validate')
const { getLastOneSchema, getByDaysSchema } = require('../schemas/marketIndexSchema')
const redisCacheMiddleware = require('../middleware/redisCacheMiddleware')

router.get('/', marketIndexController.getAll)
router.get('/momentum', verifyToken, marketIndexController.getMomentum)
router.get('/last/:symbol', validate(getLastOneSchema, 'params'), marketIndexController.getLstOne)
router.get(
	'/momentum/range/:days',
	verifyToken,
	validate(getByDaysSchema, 'params'),
	marketIndexController.getMarketIndicesByDays
)
router.get('/weights', verifyToken, redisCacheMiddleware(3600), marketIndexController.getWeights)
router.get('/stock/prices', verifyToken, redisCacheMiddleware(3600), marketIndexController.getStockPrices)
router.get('/stock/symbols', verifyToken, redisCacheMiddleware(3600), marketIndexController.getStockSymbol)
router.get('/stock/breadth', verifyToken, redisCacheMiddleware(3600), marketIndexController.getMarketBreadth)
router.get('/stock/winners', verifyToken, redisCacheMiddleware(3600), marketIndexController.getStockWinners)
router.get('/stock/losers', verifyToken, redisCacheMiddleware(3600), marketIndexController.getStockLosers)

module.exports = router
