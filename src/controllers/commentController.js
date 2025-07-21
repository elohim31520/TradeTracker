'use strict'
const commentService = require('../services/commentService')
const { success, fail } = require('../modules/responseHelper')
const _get = require('lodash/get')

class CommentController {
	/** 創建評論 */
	async createComment(req, res, next) {
		try {
			const data = req.body
			const comments = await commentService.createComment({ ...data, userId: _get(req, 'user.id') })
			return res.status(201).json(success(comments, '評論創建成功'))
		} catch (error) {
			next(error)
		}
	}

	/** 獲取新聞的評論列表 */
	async getCommentsByPostId(req, res, next) {
		try {
			const { postId } = req.params
			const options = req.query
			const comments = await commentService.getCommentsByPostId(postId, options)
			return res.json(success(comments))
		} catch (error) {
			next(error)
		}
	}

	/** 獲取評論的回覆 */
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

	/** 獲取單個評論 */
	async getCommentById(req, res, next) {
		try {
			const { id } = req.params
			const comments = await commentService.getCommentById(id)
			return res.json(success(comments))
		} catch (error) {
			next(error)
		}
	}

	/** 更新評論 */
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

	/** 刪除評論 */
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
