import express from 'express'
import companyNewsController from '../controllers/companyNewsController'
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
import { bulkCreateSchema, createSchema, getAllSchema, searchByKeywordSchema } from '../schemas/companyNewsSchema'

const router = express.Router()
router.use(verifyToken)

router.post('/batch', validate(bulkCreateSchema), companyNewsController.bulkCreate)
router.post('/', validate(createSchema), companyNewsController.create)
router.get('/', validate(getAllSchema, 'query'), companyNewsController.getAll)
router.get('/search', validate(searchByKeywordSchema, 'query'), companyNewsController.getAll)

module.exports = router
