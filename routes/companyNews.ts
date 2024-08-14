import express from 'express'
import companyNewsController from '../controllers/companyNewsController'
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
import { bulkCreateSchema } from '../schemas/companyNewsSchema'

const router = express.Router()

router.post('/', verifyToken, validate(bulkCreateSchema), companyNewsController.bulkCreate)

module.exports = router
