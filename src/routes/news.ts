import express from 'express'
import newsController from '../controllers/newsController'
import { verifyToken } from '../middleware/auth'
import { verifyAdmin } from '../middleware/adminAuth'
import validate from '../middleware/validate'
import { updateSchema, deleteSchema, createSchema, bulkCreateSchema, idSchema } from '../schemas/newsSchema'

const router = express.Router()

router.get('/', newsController.getAllNews)
router.get('/:id', newsController.getNewsById)
router.post('/bulkCreate', verifyToken, verifyAdmin, validate(bulkCreateSchema), newsController.bulkCreateNews)
router.post('/', verifyToken, verifyAdmin, validate(createSchema), newsController.createNews)
router.put(
	'/:id',
	verifyToken,
	verifyAdmin,
	validate(updateSchema),
	validate(idSchema, 'params'),
	newsController.updateNews
)
router.delete('/:id', verifyToken, verifyAdmin, validate(deleteSchema, 'params'), newsController.deleteNews)

export default router
