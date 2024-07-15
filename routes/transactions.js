const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { verifyToken } = require('../middleware/auth')

router.post('/', verifyToken, transactionController.create)
router.get('/', verifyToken, transactionController.getAll)
router.get('/:id', verifyToken, transactionController.getById)
router.put('/:id', verifyToken, transactionController.update)
router.delete('/:id', verifyToken, transactionController.delete)

module.exports = router
