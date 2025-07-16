import { OAuth2Client, TokenPayload } from 'google-auth-library'
import models from '../../models'
import type { DB } from '../types/db'
import { generateToken } from '../modules/crypto'
import { ClientError, ServerError } from '../modules/errors'
const db = models as unknown as DB

const googleOAuth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)

class GoogleAuthService {
	async handleGoogleAuthCode(authCode: string) {
		try {
			// 1. 交換授權碼以獲取 token
			const { tokens } = await googleOAuth.getToken(authCode)
			googleOAuth.setCredentials(tokens)

			const { id_token, refresh_token: refreshToken, access_token: accessToken } = tokens

			if (!id_token) {
				throw new ClientError('從 Google 獲取 ID_Token 失敗')
			}

			// 2. 驗證 ID token
			const ticket = await googleOAuth.verifyIdToken({
				idToken: id_token,
				audience: process.env.GOOGLE_CLIENT_ID,
			})

			const payload = ticket.getPayload() as TokenPayload
			if (!payload) throw new ClientError('無效的 token payload')
			if (!payload.sub || !payload.email) throw new ClientError('缺少必要的用戶資訊')

			if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
				throw new ClientError('token audience 不匹配!')
			}
			if (payload.iss !== 'https://accounts.google.com') {
				throw new ClientError('issuer發行商 不匹配!')
			}

			// 檢查 token 是否過期
			const currentTime = Math.floor(Date.now() / 1000) // 轉換為秒
			if (payload.exp && payload.exp < currentTime) {
				throw new ClientError('Google token 已過期')
			}

			const { sub: googleId, email, name } = payload

			// 處理使用者和外部帳號
			let user
			const thirdpartyAccount = await db.ThirdpartyAccount.findOne({
				where: { provider: 'google', providerUserId: googleId },
				include: [{ model: db.Users, as: 'user' }],
			})

			if (thirdpartyAccount) {
				// 如果已存在外部帳號，直接取得使用者
				user = thirdpartyAccount.user

				await thirdpartyAccount.update({
					refreshToken,
					accessToken,
				})
			} else {
				// 否則，尋找或創建使用者，然後創建外部帳號
				let localUser = await db.Users.findOne({ where: { email } })

				if (!localUser) {
					// 如果本地使用者不存在，則創建新使用者
					localUser = await db.Users.create({
						user_name: name || `google_${googleId}`,
						email,
					})
				}

				// 創建新的外部帳號並與使用者關聯
				const [newExternalAccount, created] = await db.ThirdpartyAccount.findOrCreate({
					where: { provider: 'google', providerUserId: googleId },
					defaults: {
						userId: (localUser as any).id,
						provider: 'google',
						providerUserId: googleId,
						refreshToken,
						accessToken,
					},
				})

				if (!created && refreshToken) {
					await newExternalAccount.update({ refreshToken })
				}
				user = localUser
			}

			if (!user) {
				throw new ServerError('無法創建或找到用戶')
			}

			return {
				token: generateToken({ user_name: user.user_name }),
				expiresIn: payload.exp ? payload.exp - currentTime : null, // 返回剩餘有效時間（秒）
			}
		} catch (error) {
			if (error instanceof ClientError) {
				throw error
			}
			console.error('Google 身份驗證失敗', error)
			throw new ClientError('Google 身份驗證失敗')
		}
	}
}

export default new GoogleAuthService()
