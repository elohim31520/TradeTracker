const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.create);
router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

module.exports = router
