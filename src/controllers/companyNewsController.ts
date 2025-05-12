import { Request, Response, NextFunction } from 'express'
import companyNewsService from '../services/companyNewsService'
import _ from 'lodash'
const responseHelper = require('../js/responseHelper')

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
			const page = Number(req.query.page)
			const size = Number(req.query.size)
			const news = await companyNewsService.getAll(page, size)
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
	async searchByKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const page = Number(req.query.page)
			const size = Number(req.query.size)
			const keyword = String(req.query.keyword)
			const news = await companyNewsService.searchByKeyword({
				page,
				size,
				keyword,
			})
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

export default new CompanyNewsController()
