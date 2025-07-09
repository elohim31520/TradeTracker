const _ = require('lodash')
const { ClientError } = require('../modules/errors')

const validate = (schema, property = 'body') => {
	return (req, res, next) => {
		const result = schema.validate(req[property])
		const { error } = result
		if (error) {
			const errorMessage = _.get(error, 'details[0].message', 'Validation error')
			next(new ClientError(errorMessage))
		}
		next()
	}
}

module.exports = validate
