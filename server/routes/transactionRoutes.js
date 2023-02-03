const express = require('express');
const transactionController = require('./../controllers/transactionController');

const router = express.Router();

router
    .get('/', transactionController.getAlltransactions)
    .post('/', transactionController.createtransaction)
    .get('/:id', transactionController.gettransaction)
    .patch('/:id', transactionController.updatetransaction)
    .delete('/:id', transactionController.deletetransaction);

module.exports = router;