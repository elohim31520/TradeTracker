const express = require('express')
const router = express.Router()
const technewsController = require('../controllers/technewsController')
const validate = require('../middleware/validate')
const { getByIdSchema, getAllSchema } = require('../schemas/technewsSchema')

router.get('/', validate(getAllSchema, 'query'), technewsController.getAll)
router.get('/:id', validate(getByIdSchema, 'params'), technewsController.getById)
module.exports = router