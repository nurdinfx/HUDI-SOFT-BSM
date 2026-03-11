const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch' // Optional for global accounts like capital
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
