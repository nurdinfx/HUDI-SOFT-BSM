const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create purchase order
// @route   POST /api/v1/purchases
// @access  Private (Inv. Manager / Super Admin)
exports.createPurchase = async (req, res, next) => {
    try {
        const count = await Purchase.countDocuments() + 1;
        const purchaseOrderNumber = `PO-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;

        req.body.purchaseOrderNumber = purchaseOrderNumber;
        req.body.createdBy = req.user.id;
        req.body.branch = req.user.branch;

        const purchase = await Purchase.create(req.body);
        res.status(201).json({ success: true, data: purchase });
    } catch (err) {
        next(err);
    }
};

// @desc    Receive goods (GRN)
// @route   PUT /api/v1/purchases/:id/receive
// @access  Private (Inv. Manager)
exports.receiveGoods = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const purchase = await Purchase.findById(req.params.id).session(session);
        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        if (purchase.status === 'RECEIVED') {
            return res.status(400).json({ success: false, message: 'Goods already received' });
        }

        // Update Inventory and Costs
        const Inventory = require('../models/Inventory');
        for (const item of purchase.items) {
            let inventory = await Inventory.findOne({
                product: item.product,
                branch: purchase.branch
            }).session(session);

            if (!inventory) {
                inventory = new Inventory({
                    product: item.product,
                    branch: purchase.branch,
                    quantity: 0
                });
            }

            inventory.quantity += item.quantity;
            inventory.lastStockIn = new Date();
            await inventory.save();
        }

        purchase.status = 'RECEIVED';
        await purchase.save();

        // Create transaction (Credit Accounts Payable, Debit Inventory)
        await Transaction.create([{
            type: 'CREDIT',
            category: 'PURCHASE',
            amount: purchase.totalAmount,
            description: `Purchase - ${purchase.purchaseOrderNumber}`,
            reference: { id: purchase._id, model: 'Purchase' },
            branch: purchase.branch,
            user: req.user.id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, data: purchase });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

// @desc    Get all purchases
// @route   GET /api/v1/purchases
// @access  Private
exports.getPurchases = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        }

        const purchases = await Purchase.find(query)
            .populate('supplier', 'name')
            .populate('createdBy', 'name')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: purchases.length, data: purchases });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single purchase
// @route   GET /api/v1/purchases/:id
// @access  Private
exports.getPurchase = async (req, res, next) => {
    try {
        const purchase = await Purchase.findById(req.params.id)
            .populate('supplier', 'name')
            .populate('items.product', 'name sku');

        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        res.status(200).json({ success: true, data: purchase });
    } catch (err) {
        next(err);
    }
};

// @desc    Update purchase
// @route   PUT /api/v1/purchases/:id
// @access  Private (Inv. Manager / Super Admin)
exports.updatePurchase = async (req, res, next) => {
    try {
        let purchase = await Purchase.findById(req.params.id);

        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        if (purchase.status === 'RECEIVED') {
            return res.status(400).json({ success: false, message: 'Cannot update received purchase order' });
        }

        purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: purchase });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete purchase
// @route   DELETE /api/v1/purchases/:id
// @access  Private (Inv. Manager / Super Admin)
exports.deletePurchase = async (req, res, next) => {
    try {
        const purchase = await Purchase.findById(req.params.id);

        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        if (purchase.status === 'RECEIVED') {
            return res.status(400).json({ success: false, message: 'Cannot delete received purchase order' });
        }

        await purchase.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
