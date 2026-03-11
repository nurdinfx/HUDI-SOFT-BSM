const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Purchase = require('../models/Purchase');
const Branch = require('../models/Branch');

// @desc    Get global dashboard stats
// @route   GET /api/v1/reports/dashboard
// @access  Private (Super Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalRevenue = await Sale.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const salesCount = await Sale.countDocuments({ status: 'COMPLETED' });

        // New data for Dashboard
        const Customer = require('../models/Customer');
        const activeCustomers = await Customer.countDocuments();

        const recentSales = await Sale.find({ status: 'COMPLETED' })
            .populate('customer', 'name')
            .sort('-createdAt')
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                revenue: totalRevenue[0]?.total || 0,
                expenses: totalExpenses[0]?.total || 0,
                salesCount,
                profit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
                activeCustomers,
                recentSales
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get branch-specific performance
// @route   GET /api/v1/reports/branches
// @access  Private (Super Admin)
exports.getBranchPerformance = async (req, res, next) => {
    try {
        const performance = await Sale.aggregate([
            { $match: { status: 'COMPLETED' } },
            {
                $group: {
                    _id: '$branch',
                    totalSales: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'branchDetails'
                }
            },
            { $unwind: '$branchDetails' }
        ]);

        res.status(200).json({ success: true, data: performance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get sales vs expenses (monthly, last 6 months)
// @route   GET /api/v1/reports/timeseries
// @access  Private (Super Admin)
exports.getSalesVsExpenses = async (req, res, next) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const sales = await Sale.aggregate([
            { $match: { status: 'COMPLETED', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        const expenses = await Expense.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Merge results into a 6-month array
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const results = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date(sixMonthsAgo);
            date.setMonth(sixMonthsAgo.getMonth() + i);
            const m = date.getMonth() + 1;
            const y = date.getFullYear();

            const sale = sales.find(s => s._id.month === m && s._id.year === y);
            const expense = expenses.find(e => e._id.month === m && e._id.year === y);

            results.push({
                name: months[m - 1],
                sales: sale?.total || 0,
                expenses: expense?.total || 0,
                month: m,
                year: y
            });
        }

        res.status(200).json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};
