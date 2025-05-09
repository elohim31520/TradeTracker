import { Request, Response, NextFunction } from 'express'
import companyNewsService from '../services/companyNewsService'
import _ from 'lodash'
const responseHelper = require('../js/responseHelper')
const { ClientError } = require('../js/errors')

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
			const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1)
			const size = Math.max(parseInt(req.query.size as string, 10) || 10, 1)

			if (page <= 0 || size <= 0) {
				throw new ClientError(`Invalid request parameters! Page: ${page}, Size: ${size}`)
			}
			const news = await companyNewsService.getAll(page, size)
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
	async searchByKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1)
			const size = Math.max(parseInt(req.query.size as string, 10) || 10, 1)
			const keyword = req.query.keyword as string

			if (page <= 0 || size <= 0) {
				throw new ClientError(`Invalid request parameters! Page: ${page}, Size: ${size}`)
			}
			const news = await companyNewsService.searchByKeyword({ page, size, keyword })
			res.status(200).json(responseHelper.success(news))
		} catch (error) {
			next(error)
		}
	}
}

export default new CompanyNewsController()
