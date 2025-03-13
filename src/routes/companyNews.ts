import express from 'express'
import companyNewsController from '../controllers/companyNewsController'
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
import { bulkCreateSchema, createSchema } from '../schemas/companyNewsSchema'

const router = express.Router()

router.post('/bulk', verifyToken, validate(bulkCreateSchema), companyNewsController.bulkCreate)
router.post('/', verifyToken, validate(createSchema), companyNewsController.create)
router.get('/', companyNewsController.getAll)
router.get('/query', verifyToken, companyNewsController.searchByKeyword)

module.exports = router
