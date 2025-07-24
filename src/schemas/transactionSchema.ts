import Joi from 'joi'

const createSchema = Joi.object({
	stock_id: Joi.string().required(),
	transaction_type: Joi.string().valid('buy', 'sell').required(),
	quantity: Joi.number().integer().positive().required(),
	price: Joi.number().precision(2).positive().required(),
	transaction_date: Joi.date().iso().required(),
})

export { createSchema } 