const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['RENT', 'SALARY', 'UTILITIES', 'MAINTENANCE', 'MARKETING', 'TRANSPORT', 'SUPPLIES', 'OTHER']
    },
    amount: {
        type: Number,
        required: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    paidFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
