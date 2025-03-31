import Joi from 'joi'

const updateSchema = Joi.object({
	stock_id: Joi.string().required(),
	quantity: Joi.number().optional(),
    average_price: Joi.number().precision(2).optional(),
})

export { updateSchema }
