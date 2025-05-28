'use strict'
const db = require('../../models')
const { Comments, Users, tech_investment_news } = db
const { getUserIdByUsername } = require('../js/dbUtils')

class CommentService {
	/**
	 * 創建評論
	 * @param {Object} data - 評論數據
	 * @returns {Promise<Object>} 創建的評論
	 */
	async createComment(data) {
		const userId = await getUserIdByUsername(db, data.userName)
		const { userName, ...rest } = data
		const comment = await Comments.create({ ...rest, userId })
		return comment
	}

	/**
	 * 根據ID獲取評論
	 * @param {Number} id - 評論ID
	 * @returns {Promise<Object>} 評論對象
	 */
	async getCommentById(id) {
		const comment = await Comments.findByPk(id, {
			include: [
				{
					model: Users,
					as: 'author',
					attributes: ['id', 'name'],
				},
				{
					model: Users,
					as: 'toUser',
					attributes: ['id', 'name'],
				},
				{
					model: Comments,
					as: 'parent',
				},
				{
					model: tech_investment_news,
					as: 'newsPost',
					attributes: ['id', 'title', 'web_url'],
				},
			],
			raw: true,
		})
		return comment
	}

	/**
	 * 獲取新聞的評論列表
	 * @param {Number} postId - 新聞ID
	 * @param {Object} options - 分頁和排序選項
	 * @returns {Promise<Array>} 評論列表
	 */
	async getCommentsByPostId(postId, options = {}) {
		const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = options
		const offset = (page - 1) * limit

		const comments = await Comments.findAndCountAll({
			where: { postId, parentId: null },
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: Users,
					as: 'author',
					attributes: ['id', 'user_name', 'email'],
				},
				// {
				// 	model: Comments,
				// 	as: 'parent',
				// },
			],
			nest: true,
			raw: true,
		})
		return comments
	}

	/**
	 * 獲取評論的回覆
	 * @param {Number} parentId - 父評論ID
	 * @param {Object} options - 分頁和排序選項
	 * @returns {Promise<Array>} 回覆列表
	 */
	async getRepliesByParentId(parentId, options = {}) {
		const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = options
		const offset = (page - 1) * limit

		const replies = await Comments.findAndCountAll({
			where: { parentId },
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: Users,
					as: 'author',
					attributes: ['id', 'user_name'],
				},
				{
					model: Users,
					as: 'toUser',
					attributes: ['id', 'user_name'],
				},
			],
			nest: true,
			raw: true,
		})
		return replies
	}

	/**
	 * 更新評論
	 * @param {Number} id - 評論ID
	 * @param {Object} commentData - 更新的評論數據
	 * @returns {Promise<Object>} 更新後的評論
	 */
	async updateComment(id, commentData) {
		const comment = await Comments.findByPk(id)
		if (!comment) {
			throw new Error('評論不存在')
		}

		await comment.update(commentData)
		return comment
	}

	/**
	 * 刪除評論
	 * @param {Number} id - 評論ID
	 * @returns {Promise<Boolean>} 刪除結果
	 */
	async deleteComment(id) {
		const comment = await Comments.findByPk(id)
		if (!comment) {
			throw new Error('評論不存在')
		}

		await comment.destroy()
		return true
	}
}

module.exports = new CommentService()
