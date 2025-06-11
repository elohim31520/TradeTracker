const Joi = require('joi')

const createAdminSchema = Joi.object({
	userId: Joi.alternatives().try(
		Joi.number(),
		Joi.string().pattern(/^\d+$/)
	).required(),
})

module.exports = {
	createAdminSchema,
	deleteUserSchema: createAdminSchema,
}
