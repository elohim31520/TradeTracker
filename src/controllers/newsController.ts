import { Request, Response, NextFunction } from 'express'
import newsService from '../services/newsService'
import { success, fail } from '../modules/responseHelper'

class NewsController {
	async getAllNews(req: Request, res: Response, next: NextFunction) {
		try {
			const news = await newsService.getAllNews()
			res.json(success(news))
		} catch (error) {
			next(error)
		}
	}

	async getNewsById(req: Request, res: Response, next: NextFunction) {
		try {
			const news = await newsService.getNewsById(req.params.id)
			if (news) {
				res.json(success(news))
			}
		} catch (error) {
			next(error)
		}
	}

	async createNews(req: Request, res: Response, next: NextFunction) {
		try {
			const news = await newsService.createNews(req.body)
			res.json(success(news))
		} catch (error) {
			next(error)
		}
	}

	async bulkCreateNews(req: Request, res: Response, next: NextFunction) {
		try {
			const news = await newsService.bulkCreateNews(req.body)
			res.json(success(news))
		} catch (error) {
			next(error)
		}
	}

	async updateNews(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id
			const news = await newsService.updateNews(id, req.body)
			res.json(success(news))
		} catch (error) {
			next(error)
		}
	}

	async deleteNews(req: Request, res: Response, next: NextFunction) {
		try {
			const done = await newsService.deleteNews(req.params.id)
			if (done) {
				res.json(success(done))
			}
		} catch (error) {
			next(error)
		}
	}
}

export default new NewsController()
