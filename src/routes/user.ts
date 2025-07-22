import express, { Router } from 'express'
import validate from '../middleware/validate'
import { registerSchema, loginSchema } from '../schemas/authSchema'
import userController from '../controllers/userController'
import googleAuthController from '../controllers/googleAuthController'

const router: Router = express.Router()

router.post('/register', validate(registerSchema), userController.create)
router.post('/login', validate(loginSchema), userController.login)
router.post('/google/login', googleAuthController.googleLogin)

export default router 