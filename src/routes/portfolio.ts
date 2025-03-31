import express from 'express'
import portfolioController from '../controllers/portfolioController'
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
import { updateSchema } from '../schemas/portfolioSchema'

const router = express.Router()

router.get('/', verifyToken, portfolioController.getByUserId)
router.put('/', verifyToken, validate(updateSchema), portfolioController.updatePortfolio)

module.exports = router
