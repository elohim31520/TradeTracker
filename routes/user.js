const express = require('express')
const router = express.Router()
const { createUser, userLogin } = require("../crud/user")
const { validateLogin } = require('./validate')

router.post("/register", async (req, res) => {
	const resp = await createUser(req.body)
	res.json(resp)
})

router.post("/login", validateLogin, async (req, res) => {
	const resp = await userLogin(req.body)
	res.json(resp)
})

module.exports = router