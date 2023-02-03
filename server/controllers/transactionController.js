const factory = require('./handleFactory');
const transaction = require('../model/transactionModel');

exports.getAlltransactions = factory.getAll(transaction);
exports.gettransaction = factory.getOne(transaction);
exports.createtransaction = factory.createOne(transaction);
exports.updatetransaction = factory.updateOne(transaction);
exports.deletetransaction = factory.deleteOne(transaction);
