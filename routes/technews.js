const express = require('express')
const router = express.Router()
const technewsController = require('../controllers/technewsController')

router.get('/search', technewsController.searchByKeyword)
router.get('/:id', technewsController.getById)
router.get('/', technewsController.getAll)

module.exports = router