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
			userId: Joi.number().required(),
			symbo: Joi.string().required(),
			share: Joi.number().required(),
			price: Joi.number().required()
		})
	)
	const params = req.body
	const result = schema.validate(params)

	if (result.error) {
		res.status(400).json({ code: 400, msg: "value must be an array" })
	} else next()
}

function validateParamsOfDel(req, res, next) {
	const schema = Joi.object({
		id: Joi.string().required(),
		userId: Joi.string().required(),
		company: Joi.string().required()
	});
	const params = Object.assign({}, req.params, req.query)
	const result = schema.validate(params)

	if (result.error) {
		res.status(400).json({ code: 400, msg: "id, userId, company is required" })
	} else {
		next()
	}
}

function validateParamsOfUpdate(req, res, next) {
	validateParamsOfDel(req, res, next)
}

module.exports = {
	validateParamsOfGet,
	validateParamsOfAdd,
	validateParamsOfDel,
	validateParamsOfUpdate
}