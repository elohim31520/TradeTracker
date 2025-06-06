const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const validate = require('../middleware/validate')
const {
	createCommentSchema,
	updateCommentSchema,
	getByIdSchema,
	getByPostIdSchema,
	getByParentIdSchema,
	commentPaginationSchema,
} = require('../schemas/commentSchema')
const { verifyToken } = require('../middleware/auth')
const { userContext } = require('../middleware/userContext')

router.use(verifyToken, userContext)

// 創建評論
router.post('/', validate(createCommentSchema), commentController.createComment)

// 獲取新聞的評論列表
router.get(
	'/post/:postId',
	validate(getByPostIdSchema, 'params'),
	validate(commentPaginationSchema, 'query'),
	commentController.getCommentsByPostId
)

// 獲取評論的回覆
router.get(
	'/replies/:parentId',
	validate(getByParentIdSchema, 'params'),
	validate(commentPaginationSchema, 'query'),
	commentController.getRepliesByParentId
)

// 獲取單個評論
router.get('/:id', validate(getByIdSchema, 'params'), commentController.getCommentById)

// 更新評論
router.put(
	'/:id',
	validate(getByIdSchema, 'params'),
	validate(updateCommentSchema),
	commentController.updateComment
)

// 刪除評論
router.delete('/:id', validate(getByIdSchema, 'params'), commentController.deleteComment)

module.exports = router
