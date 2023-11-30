const Joi = require('joi');

function validateParamsOfSet(req, res, next) {
	const schema = Joi.object({
		newsId: Joi.number().required()
	})
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		throw new Error(400)
	} else next()
}

module.exports = {
	validateParamsOfSet,
}