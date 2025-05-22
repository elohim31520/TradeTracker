'use strict'
const commentService = require('../services/commentService')
const { success, fail } = require('../js/responseHelper')
const { getUserNameFromReq } = require('../js/util')

class CommentController {
	/**
	 * 創建評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async createComment(req, res, next) {
		try {
			const data = req.body
			const userName = getUserNameFromReq(req)
			const comments = await commentService.createComment({ ...data, userName })
			return res.status(201).json(success(comments, '評論創建成功'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 獲取新聞的評論列表
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getCommentsByPostId(req, res, next) {
		try {
			const { postId } = req.params
			const options = req.query
			const comments = await commentService.getCommentsByPostId(postId, options)
			return res.json(success(comments))
		} catch (error) {
			const code = errorCodes.SERVER_ERROR.code
			return res.status(code).json(fail(code, error.message))
		}
	}

	/**
	 * 獲取評論的回覆
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getRepliesByParentId(req, res, next) {
		try {
			const { parentId } = req.params
			const options = req.query

			const replies = await commentService.getRepliesByParentId(parentId, options)
			return res.json(success(replies))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 獲取單個評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getCommentById(req, res, next) {
		try {
			const { id } = req.params
			const comments = await commentService.getCommentById(id)
			return res.json(success(comments))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 更新評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async updateComment(req, res, next) {
		try {
			const { id } = req.params
			const data = req.body
			const updatedComment = await commentService.updateComment(id, data)
			return res.json(success(updatedComment, '評論更新成功'))
		} catch (error) {
			next(error)
		}
	}

	/**
	 * 刪除評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async deleteComment(req, res, next) {
		try {
			const { id } = req.params
			await commentService.deleteComment(id)
			return res.json(success([], '評論刪除成功'))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new CommentController()
