import express from 'express'
import newsController from '../controllers/newsController'
import { verifyToken } from '../middleware/auth'
import { verifyAdmin } from '../middleware/adminAuth'

const router = express.Router()

router.get('/', newsController.getAllNews)
router.get('/:id', newsController.getNewsById)
router.post('/', verifyToken, verifyAdmin, newsController.createNews)
router.put('/:id', verifyToken, verifyAdmin, newsController.updateNews)
router.delete('/:id', verifyToken, verifyAdmin, newsController.deleteNews)

export default router
