import express from 'express'
import { verifyToken } from '../middleware/auth'
import marketController from '../controllers/marketIndexController'
import validate from '../middleware/validate'
import { getLastOneSchema, getByDaysSchema } from '../schemas/marketIndexSchema'
import redisCache from '../middleware/redisCache'
import conditionalCache from '../middleware/conditionalCache'
import { DAILY_UPDATE_CACHE_TTL } from '../constant/cache'

const router = express.Router()

const momentumRangeCacheCondition = (req: express.Request) => {
	const days = parseInt(req.params.days, 10)
	return [3, 7, 30, 60].includes(days)
}

// 路由應由最具體到最通用排序，以避免動態路由攔截靜態路由

// --- 靜態路由 (Static Routes) ---

router.get('/', marketController.getAll)
router.get('/stock/today', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getTodayStocks)
router.get('/stock/winners', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getTop5StockWinners)
router.get('/stock/losers', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getTop5StockLosers)
router.get('/stock/symbols', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockSymbol)
router.get('/stock/breadth', redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getMarketBreadth)

router.get('/momentum', verifyToken, marketController.getMomentum)
router.get('/weights', verifyToken, redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getWeights)
router.get('/stock/prices', verifyToken, redisCache(DAILY_UPDATE_CACHE_TTL), marketController.getStockPrices)

// 當 days 為 1 時，不需驗證 token 並強制快取，這是前端的需求
router.get(
	'/momentum/range/1',
	// 手動設定 params.days 以便後續的 validate 和 controller 能正確取值
	(req, res, next) => {
		req.params.days = '1';
		return next();
	},
	validate(getByDaysSchema, 'params'),
	redisCache(DAILY_UPDATE_CACHE_TTL),
	marketController.getMarketIndicesByDays
)


// --- 動態路由 (Dynamic Routes) ---

router.get('/last/:symbol', validate(getLastOneSchema, 'params'), marketController.getLstOne)

router.get(
	'/momentum/range/:days',
	verifyToken,
	validate(getByDaysSchema, 'params'),
	conditionalCache(DAILY_UPDATE_CACHE_TTL, momentumRangeCacheCondition),
	marketController.getMarketIndicesByDays
)

// 這個最通用的動態路由必須放在最後
router.get('/:symbol', marketController.getMarketDataBySymbol)

export default router 