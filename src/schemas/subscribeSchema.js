const Joi = require('joi')

const createSchema = Joi.object({
	newsId: Joi.number().required()
})

module.exports = {
	createSchema
}
