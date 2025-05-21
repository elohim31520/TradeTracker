'use strict'
const commentService = require('../service/commentService')
const { success, fail } = require('../js/responseHelper')
const errorCodes = require('../constant/errorCodes')
const { getUserNameFromReq } = require('../js/util')

class CommentController {
	/**
	 * 創建評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async createComment(req, res) {
		try {
			const data = req.body
			const userName = getUserNameFromReq(req)
			const comments = await commentService.createComment({ ...data, userName })
			return res.status(201).json(success(comments, '評論創建成功'))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}

	/**
	 * 獲取新聞的評論列表
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getCommentsByPostId(req, res) {
		try {
			const { postId } = req.params
			const options = req.query
			const comments = await commentService.getCommentsByPostId(postId, options)
			return res.json(success(comments))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}

	/**
	 * 獲取評論的回覆
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getRepliesByParentId(req, res) {
		try {
			const { parentId } = req.params
			const options = req.query

			const replies = await commentService.getRepliesByParentId(parentId, options)
			return res.json(success(replies))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}

	/**
	 * 獲取單個評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async getCommentById(req, res) {
		try {
			const { id } = req.params
			const comments = await commentService.getCommentById(id)
			return res.json(success(comments))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}

	/**
	 * 更新評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async updateComment(req, res) {
		try {
			const { id } = req.params
			const data = req.body
			const updatedComment = await commentService.updateComment(id, data)
			return res.json(success(updatedComment, '評論更新成功'))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}

	/**
	 * 刪除評論
	 * @param {Object} req - 請求對象
	 * @param {Object} res - 響應對象
	 */
	async deleteComment(req, res) {
		try {
			const { id } = req.params
			await commentService.deleteComment(id)
			return res.json(success([], '評論刪除成功'))
		} catch (error) {
			const SERVER_ERROR = errorCodes.SERVER_ERROR.code
			return res.status(SERVER_ERROR).json(fail(SERVER_ERROR, error.message))
		}
	}
}

module.exports = new CommentController()
