const Joi = require('joi');

function validateParamsOfGet(req, res, next) {
	const schema = Joi.object({
		userId: Joi.string().required(),
		company: Joi.string()
	})
	const userId = req.params.userId
	const company = req.query.company
	const result = schema.validate({ userId, company })

	if (result.error) {
		res.status(400).json(result.error)
	} else next()
}

function validateParamsOfAdd(req, res, next) {
	const schema = Joi.array().items(
		Joi.object({
			userId: Joi.string().required(),
			company: Joi.string().required(),
			share: Joi.number().required(),
			price: Joi.number().required(),
			dividend: Joi.number(),
			total: Joi.number(),
			open_time: Joi.string()
		})
	)
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		res.status(400).json({ code: 400, msg: "value must be an array" })
	} else next()
}

function validateParamsOfDel (req, res, next) {
	const schema = Joi.object({
		userId: Joi.string().required(),
		id: Joi.number().required()
	})
	const result = schema.validate(req.body)
	if (result.error) {
		res.status(400).json({ code: 400, msg: "userId & id is required" })
	} else next()
}

module.exports = {
	validateParamsOfGet,
	validateParamsOfAdd,
	validateParamsOfDel
}