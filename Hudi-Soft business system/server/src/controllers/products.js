const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Branch = require('../models/Branch');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Private
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        next(err);
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private (Inv. Manager / Super Admin)
exports.createProduct = async (req, res, next) => {
    try {
        const { initialStock, ...productData } = req.body;
        const initialQty = Number(initialStock) || 0;

        const product = await Product.create(productData);

        // Initialize inventory for branches
        if (req.user.role === 'SUPER_ADMIN') {
            // Get all branches and initialize inventory for each
            const branches = await Branch.find({ isActive: true });
            const inventoryRecords = branches.map(branch => ({
                product: product._id,
                branch: branch._id,
                quantity: initialQty
            }));
            await Inventory.insertMany(inventoryRecords);
        } else if (req.user.branch) {
            // Initialize inventory for the user's branch
            await Inventory.create({
                product: product._id,
                branch: req.user.branch,
                quantity: initialQty
            });
        }

        await product.populate('category', 'name');

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Private
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Inv. Manager / Super Admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if there is inventory associated that prevents deletion (optional business logic)
        // For now, simple delete
        await product.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
