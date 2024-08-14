import Joi from 'joi'

const newsSchema = Joi.object({
	newsId: Joi.number().required(),
	title: Joi.string().required(),
	symbol: Joi.string().required(),
	release_time: Joi.date().optional(),
	publisher: Joi.string().optional(),
	web_url: Joi.string().optional(),
})

const bulkCreateSchema = Joi.array().items(newsSchema)

export {
	bulkCreateSchema,
}
