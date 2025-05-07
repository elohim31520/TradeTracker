const _get = require('lodash/get')
const logger = require('../logger.js')
const userFavoriteService = require('../services/userFavoriteService')
const responseHelper = require('../js/responseHelper')
const { getUserNameFromReq } = require('../js/util')

/**
 * 創建用戶收藏技術新聞
 */
const createUserFavoriteTechNews = async (req, res) => {
	try {
		const userName = getUserNameFromReq(req)
		const newsId = _get(req, 'body.newsId')
		await userFavoriteService.createUserFavoriteTechNews(userName, newsId)
		res.json(responseHelper.success())
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
}

/**
 * 獲取用戶收藏技術新聞
 */
const getUserFavoriteTechNews = async (req, res) => {
	const userName = getUserNameFromReq(req)
	try {
		const data = await userFavoriteService.getUserFavoriteTechNews(userName)
		res.json(responseHelper.success(data))
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
}

module.exports = {
	createUserFavoriteTechNews,
	getUserFavoriteTechNews,
}
