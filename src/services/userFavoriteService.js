const Users = require('../../models/users')
const db = require('../../models')
const { getUserIdByUsername } = require('../js/dbUtils')

/**
 * 獲取用戶收藏新聞
 * @param {number} userId - 用戶ID
 * @returns {Promise<Array>} 收藏新聞列表
 */
const getUserFavoriteNews = async (userId) => {
	const user = await Users.findByPk(userId, {
		include: {
			model: db.News,
			attributes: ['id'],
			through: { attributes: [] },
		},
	})

	const allNewsId = user.News.map((vo) => vo.id)

	return db.News.findAll({
		where: {
			id: allNewsId,
		},
	})
}

/**
 * 創建用戶收藏技術新聞
 * @param {string} user_name - 用戶名
 * @param {number} newsId - 新聞ID
 * @returns {Promise<void>}
 */
const createUserFavoriteTechNews = async (userName, newsId) => {
	console.log(userName, newsId);
	const userId = await getUserIdByUsername(db, userName)
	await db.pk_user_technews.create({ userId, newsId })
}

/**
 * 獲取用戶收藏技術新聞
 * @param {string} userName - 用戶名
 * @returns {Promise<Array>} 收藏技術新聞列表
 */
const getUserFavoriteTechNews = async (userName) => {
	const result = await db.Users.findOne({
		where: { user_name: userName },
		attributes: ['id'],
		include: [
			{
				model: db.tech_investment_news,
				attributes: ['id', 'title', 'release_time', 'publisher', 'web_url'],
				through: {
					model: db.pk_user_technews,
					attributes: [],
				},
				require: false,
			},
		],
	})

	return result.dataValues.tech_investment_news
}

module.exports = {
	getUserFavoriteNews,
	createUserFavoriteTechNews,
	getUserFavoriteTechNews,
}
