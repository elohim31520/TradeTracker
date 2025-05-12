import express from 'express'
import companyNewsController from '../controllers/companyNewsController'
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
import { bulkCreateSchema, createSchema, getAllSchema, searchByKeywordSchema } from '../schemas/companyNewsSchema'

const router = express.Router()

router.post('/bulk', verifyToken, validate(bulkCreateSchema), companyNewsController.bulkCreate)
router.post('/', verifyToken, validate(createSchema), companyNewsController.create)
router.get('/', validate(getAllSchema, 'query'), companyNewsController.getAll)
router.get('/query', verifyToken, validate(searchByKeywordSchema, 'query'), companyNewsController.searchByKeyword)

module.exports = router
