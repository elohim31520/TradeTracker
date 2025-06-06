import { Request, Response, NextFunction } from 'express'
import companyNewsService from '../services/companyNewsService'
import _ from 'lodash'
const responseHelper = require('../js/responseHelper')

interface PaginationQuery {
	page: number;
	size: number;
}

interface SearchQuery extends PaginationQuery {
	keyword: string;
}

class CompanyNewsController {
	async bulkCreate(req: Request, res: Response, next: NextFunction) {
		try {
			const data = req.body
			await companyNewsService.bulkCreate(data)
			res.status(201).json(responseHelper.success([], 'Company news created successfully.'))
		} catch (error: any) {
			next(error)
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = req.body
			await companyNewsService.create(data)
			res.status(201).json(responseHelper.success(undefined, 'Company news created successfully.'))
		} catch (error: any) {
			next(error)
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const query = req.query as unknown as PaginationQuery
			const news = await companyNewsService.getAll(query.page, query.size)
			res.json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}

	async searchByKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const query = req.query as unknown as SearchQuery
			const news = await companyNewsService.searchByKeyword({
				page: query.page,
				size: query.size,
				keyword: query.keyword,
			})
			res.json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

export default new CompanyNewsController()
