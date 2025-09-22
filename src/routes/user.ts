import express, { Router } from 'express'
import validate from '../middleware/validate'
import { registerSchema, loginSchema, changePasswordSchema, googleLoginSchema } from '../schemas/authSchema'
import userController from '../controllers/userController'
import googleAuthController from '../controllers/googleAuthController'
import { verifyToken } from '../middleware/auth'
import { userContext } from '../middleware/userContext'
import { success } from '../modules/responseHelper'

const router: Router = express.Router()

router.post('/register', validate(registerSchema), userController.create)
router.post('/login', validate(loginSchema), userController.login)
router.post('/google/login', validate(googleLoginSchema), googleAuthController.googleLogin)
router.post('/password', verifyToken, userContext, validate(changePasswordSchema), userController.changePassword)
router.get('/is-login', verifyToken, (req, res) => {
	res.json(success(true))
})
export default router
