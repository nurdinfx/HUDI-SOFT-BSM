const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create new sale
// @route   POST /api/v1/sales
// @access  Private (Cashier / Manager)
exports.createSale = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, customer, paymentMethod, subtotal, tax, discount, totalAmount, payments } = req.body;
        const branchId = req.user.branch;

        // 1. Generate Invoice Number (e.g., INV-2026-0001)
        const count = await Sale.countDocuments() + 1;
        const invoiceNumber = `INV-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;

        // 2. Process Items and Update Inventory
        for (const item of items) {
            const inventory = await Inventory.findOne({
                product: item.product,
                branch: branchId
            }).session(session);

            if (!inventory || inventory.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${item.product}`);
            }

            inventory.quantity -= item.quantity;
            inventory.lastStockOut = new Date();
            await inventory.save();
        }

        // 3. Create Sale Record
        const sale = await Sale.create([{
            invoiceNumber,
            branch: branchId,
            customer,
            items,
            subtotal,
            tax,
            discount,
            totalAmount,
            paymentMethod,
            payments,
            cashier: req.user.id
        }], { session });

        // 4. Create Accounting Transaction (Debit Cash/Bank, Credit Sales)
        await Transaction.create([{
            type: 'CREDIT',
            category: 'SALE',
            amount: totalAmount,
            description: `Sale - ${invoiceNumber}`,
            reference: { id: sale[0]._id, model: 'Sale' },
            branch: branchId,
            user: req.user.id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: sale[0] });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

// @desc    Get all sales (branch-specific or global)
// @route   GET /api/v1/sales
// @access  Private
exports.getSales = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        }

        const sales = await Sale.find(query)
            .populate('customer', 'name')
            .populate('cashier', 'name')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: sales.length, data: sales });
    } catch (err) {
        next(err);
    }
};
