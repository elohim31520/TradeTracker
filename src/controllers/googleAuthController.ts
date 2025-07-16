import { Request, Response, NextFunction } from 'express'
import googleAuthService from '../services/googleAuthService'
import { success, fail } from '../modules/responseHelper'

class GoogleAuthController {
	async googleLogin(req: Request, res: Response, next: NextFunction) {
		try {
			const { authCode } = req.body
			if (!authCode) {
				return res.status(400).json(fail(400, '缺少 Google 授權碼'))
			}

			const jwt = await googleAuthService.handleGoogleAuthCode(authCode)
			res.json(success(jwt))
		} catch (error) {
			next(error)
		}
	}
}

export default new GoogleAuthController()
