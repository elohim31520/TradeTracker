const Joi = require('joi');

function validateLogin(req, res, next) {
	const schema = Joi.object({
		userId: Joi.string().required(),
		pwd: Joi.string().required()
	})
	const params = req.body
	console.log(params);
	const result = schema.validate(params)

	if (result.error) {
		throw new Error(400)
	} else next()
}

module.exports = {
	validateLogin,
}