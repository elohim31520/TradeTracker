const Joi = require('joi')

function validateRegister(req, res, next) {
	const schema = Joi.object({
		user_name: Joi.string().required(),
		pwd: Joi.string().required(),
		email: Joi.string().email().required(),
	})
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		throw new Error(400)
	} else next()
}

function validateLogin(req, res, next) {
	const schema = Joi.object({
		user_name: Joi.string().required(),
		pwd: Joi.string().required(),
	})
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		throw new Error(400)
	} else next()
}

module.exports = {
	validateRegister,
	validateLogin,
}
