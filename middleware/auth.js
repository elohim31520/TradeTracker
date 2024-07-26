const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8')
const { AuthError } = require('../js/errors')
const _ = require('lodash')

function verifyToken(req, res, next) {
	const auth = _.get(req, 'headers.authorization', '')
	const token = auth.split(' ')[1]
	if (!token || token === 'undefined') throw new AuthError()

	jwt.verify(token, publicKey, (err, decoded) => {
		if (err) {
			throw new AuthError()
		}
		req.decoded = decoded
		next()
	})
}

module.exports = {
	verifyToken,
}
