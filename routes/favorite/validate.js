const Joi = require('joi');

function validateParamsOfSet(req, res, next) {
	const schema = Joi.object({
		userId: Joi.string().required(),
		newsId: Joi.number().required()
	})
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		res.status(400).json({ code: 400, msg: "value type wrong" })
	} else next()
}

module.exports = {
	validateParamsOfSet,
}