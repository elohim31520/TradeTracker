const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const marketIndexController = require('../controllers/marketIndexController')

router.get('/', marketIndexController.getAll)
router.get('/momentum', verifyToken, marketIndexController.getMomentum)
router.get('/last/:symbol', marketIndexController.getLstOne)
router.get('/momentum/range/:days', verifyToken, marketIndexController.getMarketIndicesByDays)

module.exports = router
