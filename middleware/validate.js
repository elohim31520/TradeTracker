const validate = (schema, property = 'body') => {
	return (req, res, next) => {
		const result = schema.validate(req[property])
		console.log(result)
		const { error } = result
		if (error) {
			const { details } = error
			return res.status(400).json({ error: details[0].message })
		}
		next()
	}
}

module.exports = validate
