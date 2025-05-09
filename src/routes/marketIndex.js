const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const marketIndexController = require('../controllers/marketIndexController')

router.get('/', marketIndexController.getAll)
router.get('/momentum', verifyToken, marketIndexController.getMomentum)
router.get('/last/:symbol', marketIndexController.getLstOne)
router.get('/momentum/range/:days', verifyToken, marketIndexController.getMarketIndicesByDays)
router.get('/weights', verifyToken, marketIndexController.getWeights)
router.get('/stock/prices', verifyToken, marketIndexController.getStockPrices)
router.get('/stock/symbols', verifyToken, marketIndexController.getStockSymbol)
router.get('/stock/breadth', verifyToken, marketIndexController.getMarketBreadth)
router.get('/stock/winners', verifyToken, marketIndexController.getStockWinners)
router.get('/stock/losers', verifyToken, marketIndexController.getStockLosers)

module.exports = router
