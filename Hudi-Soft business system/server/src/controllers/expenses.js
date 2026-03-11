const Expense = require('../models/Expense');
const Transaction = require('../models/Transaction');

// @desc    Record expense
// @route   POST /api/v1/expenses
// @access  Private (Manager / Super Admin)
exports.createExpense = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.branch = req.user.branch;

        const expense = await Expense.create(req.body);

        // Create accounting transaction
        await Transaction.create({
            type: 'CREDIT',
            category: 'EXPENSE',
            amount: expense.amount,
            description: `Expense - ${expense.category}`,
            reference: { id: expense._id, model: 'Expense' },
            branch: expense.branch,
            user: req.user.id
        });

        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        next(err);
    }
};

// @desc    Get expenses
// @route   GET /api/v1/expenses
// @access  Private
exports.getExpenses = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        }
        const expenses = await Expense.find(query).sort('-date');
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (err) {
        next(err);
    }
};

// @desc    Update expense record
// @route   PUT /api/v1/expenses/:id
// @access  Private (Manager / Super Admin)
exports.updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense record not found' });
        }
        res.status(200).json({ success: true, data: expense });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete expense record
// @route   DELETE /api/v1/expenses/:id
// @access  Private (Manager / Super Admin)
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense record not found' });
        }
        await expense.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
