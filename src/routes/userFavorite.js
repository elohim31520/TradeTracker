const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createSchema } = require('../schemas/subscribeSchema')
const userFavoriteController = require('../controllers/userFavoriteController')
const { userContext } = require('../middleware/userContext')

router.use(verifyToken, userContext)

router.post('/technews', validate(createSchema), userFavoriteController.createUserFavoriteTechNews)
router.get('/technews', userFavoriteController.getUserFavoriteTechNews)

module.exports = router 