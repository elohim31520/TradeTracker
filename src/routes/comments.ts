import express, { Router } from 'express'
import commentController from '../controllers/commentController'
import validate from '../middleware/validate'
import {
	createCommentSchema,
	updateCommentSchema,
	getByIdSchema,
	getByPostIdSchema,
	getByParentIdSchema,
	commentPaginationSchema,
} from '../schemas/commentSchema'
import { verifyToken } from '../middleware/auth'
import { userContext } from '../middleware/userContext'
import { verifyAdmin } from '../middleware/adminAuth'

const router: Router = express.Router()

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
router.put('/:id', validate(getByIdSchema, 'params'), validate(updateCommentSchema), commentController.updateComment)

// 刪除評論
router.delete('/:id', verifyAdmin, validate(getByIdSchema, 'params'), commentController.deleteComment)

export default router 