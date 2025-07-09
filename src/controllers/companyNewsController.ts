import { Request, Response, NextFunction } from 'express'
import companyNewsService from '../services/companyNewsService'
import _ from 'lodash'
const responseHelper = require('../modules/responseHelper')

interface SearchQuery {
	page: number
	size: number
	keyword?: string
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
			const keyword = _.get(req, 'query.keyword', '') as string
			const page = +_.get(req, 'query.page', 1)
			const size = +_.get(req, 'query.size', 10)
			const news = await companyNewsService.getAll({
				page,
				size,
				keyword,
			})
			res.json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

export default new CompanyNewsController()
