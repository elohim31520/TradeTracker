const Joi = require('joi');

function validateParams(req, res, next) {
	const schema = Joi.object({
		userId: Joi.string().required(),
		company: Joi.string()
	})
	const userId = req.params.userId
	const company = req.query.company
	console.log("驗證參數開始",userId,company);
	const result = schema.validate({ userId, company })

	if (result.error) {
		res.status(400).json(result.error)
	} else {
		console.log("參數正確");
		next()
	}
}

module.exports = {
	validateParams
}