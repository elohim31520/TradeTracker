const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8')

function verifyToken(req, res, next) {
	const auth = req.headers.authorization
	const token = auth && auth.split(" ")[1]
	if (!token) throw new Error(401)

	jwt.verify(token, publicKey, (err, decoded) => {
		if (err) {
			throw new Error(401)
		}
		req.decoded = decoded
		next()
	})
}

module.exports = {
	verifyToken
}