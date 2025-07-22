import express from 'express'
import technewsController from '../controllers/technewsController'
import validate from '../middleware/validate'
import { getByIdSchema, getAllSchema } from '../schemas/technewsSchema'

const router = express.Router()

router.get('/', validate(getAllSchema, 'query'), technewsController.getAll)
router.get('/:id', validate(getByIdSchema, 'params'), technewsController.getById)

export default router 