const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    batchNumber: String,
    expiryDate: Date,
    lastStockIn: Date,
    lastStockOut: Date
}, {
    timestamps: true
});

// Index for fast lookups by branch and product
inventorySchema.index({ branch: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
