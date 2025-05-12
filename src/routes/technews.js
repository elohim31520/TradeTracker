const express = require('express')
const router = express.Router()
const technewsController = require('../controllers/technewsController')
const validate = require('../middleware/validate')
const { getByIdSchema, getAllSchema, searchByKeywordSchema } = require('../schemas/technewsSchema')

router.get('/search', validate(searchByKeywordSchema, 'query'), technewsController.searchByKeyword)
router.get('/:id', validate(getByIdSchema, 'params'), technewsController.getById)
router.get('/', validate(getAllSchema, 'query'), technewsController.getAll)

module.exports = router