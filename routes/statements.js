const express = require('express')
const router = express.Router()
const statementController = require('../controllers/statementController')

router.get('/:symbol', statementController.getBySymbol)

module.exports = router
