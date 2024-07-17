const express = require('express')
const router = express.Router()
const { createUser, userLogin } = require('../crud/user')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../schemas/authSchema')

router.post('/register', validate(registerSchema), async (req, res) => {
	try {
		const resp = await createUser(req.body)
		res.json(resp)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

router.post('/login', validate(loginSchema), async (req, res) => {
	try {
		const resp = await userLogin(req.body)
		res.json(resp)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

module.exports = router
