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
        status: {
            type: String,
            enum: ['COMPLETED', 'IN PROGRESS', 'REJECTED'],
            required: [true, 'status is required']
        },
    }
);

const transaction = mongoose.model('transaction', transactionschema);

module.exports = transaction;