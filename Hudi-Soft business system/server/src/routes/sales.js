const express = require('express');
const { createSale, getSales } = require('../controllers/sales');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSales)
    .post(authorize('CASHIER', 'BRANCH_MANAGER', 'SUPER_ADMIN'), auditLog('CREATE', 'SALES'), createSale);

module.exports = router;
