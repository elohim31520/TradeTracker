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
			console.log(error);
			
			next(error)
		}
	}

	async updateNews(req: Request, res: Response, next: NextFunction) {
		try {
			const news = await newsService.updateNews(req.params.id, req.body)
			if (news) {
				res.json(success(news))
			} else {
				res.status(404).send('News not found')
			}
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
