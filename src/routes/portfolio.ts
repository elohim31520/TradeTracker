import express from 'express'
import portfolioController from '../controllers/portfolioController'
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

router.get('/', verifyToken, portfolioController.getByUserId)

module.exports = router
