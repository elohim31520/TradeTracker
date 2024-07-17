const _ = require('lodash')

const validate = (schema, property = 'body') => {
	return (req, res, next) => {
		const result = schema.validate(req[property])
		console.log(result)
		const { error } = result
		if (error) {
			const errorMessage = _.get(error, 'details[0].message', 'Validation error')
			return res.status(400).json({ error: errorMessage })
		}
		next()
	}
}

module.exports = validate
