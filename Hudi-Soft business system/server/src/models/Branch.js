const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true,
        unique: true
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    address: {
        type: String,
        required: [true, 'Full address is required']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required']
    },
    email: {
        type: String,
        required: [true, 'Branch email is required'],
        lowercase: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    settings: {
        currency: { type: String, default: 'USD' },
        taxRate: { type: Number, default: 0 },
        timezone: { type: String, default: 'UTC' }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);
