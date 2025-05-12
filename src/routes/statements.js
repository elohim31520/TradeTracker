const express = require('express')
const router = express.Router()
const statementController = require('../controllers/statementController')
const validate = require('../middleware/validate')
const { getBySymbolSchema } = require('../schemas/statementSchema')

router.get('/:symbol', validate(getBySymbolSchema, 'params'), statementController.getBySymbol)

module.exports = router
