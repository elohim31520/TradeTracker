import Joi from 'joi'

const newsSchema = Joi.object({
	title: Joi.string().required(),
	symbol: Joi.string().required(),
	release_time: Joi.date().optional(),
	publisher: Joi.string().optional(),
	web_url: Joi.string().optional(),
})

const bulkCreateSchema = Joi.array().items(newsSchema)
const createSchema = newsSchema

const getAllSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	size: Joi.number().integer().min(1).max(100).default(10)
})

const searchByKeywordSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	size: Joi.number().integer().min(1).max(100).default(10),
	keyword: Joi.string().required().min(1)
})

export {
	bulkCreateSchema,
	createSchema,
	getAllSchema,
	searchByKeywordSchema
}
