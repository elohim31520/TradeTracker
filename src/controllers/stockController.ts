import stockService from '../services/stockService'
import _ from 'lodash'
import { success } from '../modules/responseHelper'
import { Request, Response, NextFunction } from 'express'

class StockController {
	async getStockSymbol(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await stockService.getStockSymbol()
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}

	async getMarketBreadth(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await stockService.getMarketBreadth()
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}

	async getTodayStocks(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await stockService.getStockDayChgSorted()
			res.json(success(data))
		} catch (error) {
			next(error)
		}
	}

	async getTop5StockWinners(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await stockService.getStockDayChgSorted()
			const top5 = data.slice(0, 5)
			res.json(success(top5))
		} catch (error) {
			next(error)
		}
	}

	async getTop5StockLosers(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await stockService.getStockDayChgSorted()
			const len = data.length
			const last5 = data.slice(len - 5, len)
			res.json(success(last5))
		} catch (error) {
			next(error)
		}
	}
}

export default new StockController()
