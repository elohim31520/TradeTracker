const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname, '../../public.key'), 'utf8')
const { AuthError } = require('../js/errors')
const _ = require('lodash')

function verifyToken(req, res, next) {
	try {
		const auth = _.get(req, 'headers.authorization', '')
		if (!auth) throw new AuthError('未提供授權標頭')

		const parts = auth.split(' ')
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			throw new AuthError('授權格式無效')
		}

		const token = parts[1]
		if (!token || token === 'undefined') {
			throw new AuthError('令牌無效')
		}
		jwt.verify(token, publicKey, (err, decoded) => {
			if (err) {
				console.error('令牌驗證錯誤:', err)
				throw new AuthError('令牌驗證失敗: ' + err.message)
			}
			req.decoded = decoded
			next()
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	verifyToken,
}
