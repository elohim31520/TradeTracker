const { AuthError } = require('../js/errors')
const db = require('../../models')

async function verifyAdmin(req, res, next) {
	try {
		const user = await db.Users.findOne({
			where: { user_name: req.decoded?.user_name },
			include: [
				{
					model: db.Admin,
					as: 'admin',
				},
			],
		})

		if (!user || !user.admin) {
			throw new AuthError('需要管理員權限')
		}

		next()
	} catch (error) {
		next(error)
	}
}

module.exports = {
	verifyAdmin,
}
