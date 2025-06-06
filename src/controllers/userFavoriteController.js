const _get = require('lodash/get')
const userFavoriteService = require('../services/userFavoriteService')
const responseHelper = require('../js/responseHelper')

/**
 * 創建用戶收藏技術新聞
 */
const createUserFavoriteTechNews = async (req, res, next) => {
	try {
		await userFavoriteService.createUserFavoriteTechNews({
			userId: _get(req, 'user.id'),
			newsId: _get(req, 'body.newsId'),
		})
		res.json(responseHelper.success())
	} catch (error) {
		next(error)
	}
}

/**
 * 獲取用戶收藏技術新聞
 */
const getUserFavoriteTechNews = async (req, res, next) => {
	try {
		const userId = _get(req, 'user.id')
		const data = await userFavoriteService.getUserFavoriteTechNews(userId)
		res.json(responseHelper.success(data))
	} catch (error) {
		next(error)
	}
}

module.exports = {
	createUserFavoriteTechNews,
	getUserFavoriteTechNews,
}
