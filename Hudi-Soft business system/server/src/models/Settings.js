const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        default: 'Hudi-Soft Retail'
    },
    logo: String,
    currency: {
        type: String,
        default: 'USD'
    },
    taxRate: {
        type: Number,
        default: 0
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    invoicePrefix: {
        type: String,
        default: 'INV-'
    },
    lowStockAlert: {
        type: Boolean,
        default: true
    },
    backupEnabled: {
        type: Boolean,
        default: false
    },
    paymentMethods: [{
        name: String,
        isActive: Boolean,
        details: mongoose.Schema.Types.Mixed
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
