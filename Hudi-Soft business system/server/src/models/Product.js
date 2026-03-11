const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    description: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    unit: {
        type: String,
        default: 'PCS',
        enum: ['PCS', 'KG', 'LITER', 'BOX', 'PACK']
    },
    costPrice: {
        type: Number,
        required: true,
        default: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 0
    },
    variants: [{
        name: String,
        value: String,
        additionalPrice: { type: Number, default: 0 }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
