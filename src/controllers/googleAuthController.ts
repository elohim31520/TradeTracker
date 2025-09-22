import { Request, Response, NextFunction } from 'express'
import googleAuthService from '../services/googleAuthService'
import { success, fail } from '../modules/responseHelper'

class GoogleAuthController {
	async googleLogin(req: Request, res: Response, next: NextFunction) {
		try {
			const { credential } = req.body
			const jwt = await googleAuthService.handleGoogleCredential(credential)
			res.json(success(jwt))
		} catch (error) {
			next(error)
		}
	}
}

export default new GoogleAuthController()
