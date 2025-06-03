const Joi = require('joi')

const createAdminSchema = Joi.object({
	userId: Joi.string().required(),
})

const deleteUserSchema = Joi.object({
	userId: Joi.string().required(),
})

module.exports = {
	createAdminSchema,
	deleteUserSchema,
}
