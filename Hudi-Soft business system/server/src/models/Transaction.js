const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['DEBIT', 'CREDIT'],
        required: true
    },
    category: {
        type: String,
        enum: ['SALE', 'PURCHASE', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT', 'REFUND'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: String,
    reference: {
        id: mongoose.Schema.Types.ObjectId,
        model: String // e.g., 'Sale', 'Purchase'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
