const mongoose = require('mongoose');

const transactionschema = new mongoose.Schema(
    {
        comments: {
            type: String,
            required: [true, 'Comments are required']
        },
        date: {
            type: Date,
            required: [true, 'Date is required']
        },
        CurrencyCd: {
            type: String,
            required:[false]

        },
        Amount: {
            type: Number,
            required:[false]
        },
        status: {
            type: String,
            enum: ['COMPLETED', 'IN PROGRESS', 'REJECTED', 'PENDING'],
            required: [true, 'status is required']
        },
        sender : {
            type : Object
        },
        recipient:{
            type : Object
        }
    }
);

const transaction = mongoose.model('transaction', transactionschema);

module.exports = transaction;