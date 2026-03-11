const express = require('express');
const { getDashboardStats, getBranchPerformance, getSalesVsExpenses } = require('../controllers/reports');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', authorize('SUPER_ADMIN'), getDashboardStats);
router.get('/branches', authorize('SUPER_ADMIN'), getBranchPerformance);
router.get('/timeseries', authorize('SUPER_ADMIN'), getSalesVsExpenses);

module.exports = router;
