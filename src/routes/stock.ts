import express from 'express'
import { verifyToken } from '../middleware/auth'
import stockController from '../controllers/stockController'
import redisCache from '../middleware/redisCache'
import { DAILY_UPDATE_CACHE_TTL } from '../constant/cache'

const router = express.Router()

router.get('/today', redisCache(DAILY_UPDATE_CACHE_TTL), stockController.getTodayStocks)
router.get('/winners', redisCache(DAILY_UPDATE_CACHE_TTL), stockController.getTop5StockWinners)
router.get('/losers', redisCache(DAILY_UPDATE_CACHE_TTL), stockController.getTop5StockLosers)
router.get('/symbols', redisCache(DAILY_UPDATE_CACHE_TTL), stockController.getStockSymbol)
router.get('/breadth', redisCache(DAILY_UPDATE_CACHE_TTL), stockController.getMarketBreadth)

export default router
