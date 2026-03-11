const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/v1/inventory
// @access  Private
exports.getInventory = async (req, res, next) => {
    try {
        let query = {};

        // Filter by branch if not super admin or if branch specifically requested
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        } else if (req.query.branch) {
            query.branch = req.query.branch;
        }

        if (req.query.product) {
            query.product = req.query.product;
        }

        const inventory = await Inventory.find(query)
            .populate('product', 'name sku barcode category unit costPrice sellingPrice')
            .populate('branch', 'name');

        res.status(200).json({ success: true, count: inventory.length, data: inventory });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single inventory item
// @route   GET /api/v1/inventory/:id
// @access  Private
exports.getInventoryItem = async (req, res, next) => {
    try {
        const inventory = await Inventory.findById(req.params.id)
            .populate('product', 'name sku')
            .populate('branch', 'name');

        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory item not found' });
        }

        res.status(200).json({ success: true, data: inventory });
    } catch (err) {
        next(err);
    }
};

// @desc    Update stock level / Adjustments
// @route   PUT /api/v1/inventory/:id
// @access  Private (Inv. Manager / Admin)
exports.updateStock = async (req, res, next) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory item not found' });
        }

        res.status(200).json({ success: true, data: inventory });
    } catch (err) {
        next(err);
    }
};
// @desc    Initialize inventory for a product
// @route   POST /api/v1/inventory
// @access  Private (Inv. Manager / Super Admin)
exports.initializeInventory = async (req, res, next) => {
    try {
        const { product, branch, quantity = 0 } = req.body;

        // Check if already exists
        let inventory = await Inventory.findOne({ product, branch });
        if (inventory) {
            return res.status(400).json({ success: false, message: 'Inventory already exists for this product in this branch' });
        }

        inventory = await Inventory.create({
            product,
            branch: branch || req.user.branch,
            quantity
        });

        const fullInventory = await Inventory.findById(inventory._id)
            .populate('product', 'name sku barcode category unit costPrice sellingPrice')
            .populate('branch', 'name');

        res.status(201).json({ success: true, data: fullInventory });
    } catch (err) {
        next(err);
    }
};
