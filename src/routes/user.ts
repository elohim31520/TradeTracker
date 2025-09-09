import express, { Router } from 'express'
import validate from '../middleware/validate'
import { registerSchema, loginSchema, changePasswordSchema } from '../schemas/authSchema'
import userController from '../controllers/userController'
import googleAuthController from '../controllers/googleAuthController'
import { verifyToken } from '../middleware/auth'
import { userContext } from '../middleware/userContext'

const router: Router = express.Router()

router.post('/register', validate(registerSchema), userController.create)
router.post('/login', validate(loginSchema), userController.login)
router.post('/google/login', googleAuthController.googleLogin)
router.post('/password', verifyToken, userContext, validate(changePasswordSchema), userController.changePassword)

export default router 