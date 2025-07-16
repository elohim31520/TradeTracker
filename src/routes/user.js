const express = require('express')
const router = express.Router()
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../schemas/authSchema')
const userController = require('../controllers/userController')
const googleAuthController = require('../controllers/googleAuthController')

router.post('/register', validate(registerSchema), userController.create)
router.post('/login', validate(loginSchema), userController.login)
router.post('/google/login', googleAuthController.googleLogin)

module.exports = router
