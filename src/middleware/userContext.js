const { Users } = require('../../models')
const { AuthError } = require('../modules/errors')

/**
 * 用戶上下文中間件
 * 此中間件會在 verifyToken 之後執行
 * 會將用戶資訊添加到 req.user 中
 */
async function userContext(req, res, next) {
    try {
        const username = req.decoded?.name
        if (!username) {
            throw new AuthError('找不到用戶名稱')
        }

        const user = await Users.findOne({ 
            where: { name: username },
            attributes: { exclude: ['pwd', 'salt'] } // 排除敏感資訊
        })

        if (!user || !user.id) {
            throw new AuthError('找不到用戶資訊')
        }

        // 將用戶資訊添加到請求物件中
        req.user = user

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userContext
} 