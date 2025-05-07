const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createSchema } = require('../schemas/subscribeSchema')
const userFavoriteController = require('../controllers/userFavoriteController')

router.post('/technews', verifyToken, validate(createSchema), userFavoriteController.createUserFavoriteTechNews)
router.get('/technews', verifyToken, userFavoriteController.getUserFavoriteTechNews)

module.exports = router 