const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/v1/suppliers
// @access  Private
exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (err) {
        next(err);
    }
};

// @desc    Create supplier
// @route   POST /api/v1/suppliers
// @access  Private
exports.createSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ success: true, data: supplier });
    } catch (err) {
        next(err);
    }
};
// @desc    Get single supplier
// @route   GET /api/v1/suppliers/:id
// @access  Private
exports.getSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (err) {
        next(err);
    }
};

// @desc    Update supplier
// @route   PUT /api/v1/suppliers/:id
// @access  Private
exports.updateSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete supplier
// @route   DELETE /api/v1/suppliers/:id
// @access  Private (Super Admin)
exports.deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        await supplier.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
