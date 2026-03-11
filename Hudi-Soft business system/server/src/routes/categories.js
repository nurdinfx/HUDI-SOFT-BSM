const express = require('express');
const { getCategories, createCategory } = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCategories)
    .post(authorize('STOCK_MANAGER', 'SUPER_ADMIN', 'BRANCH_MANAGER'), createCategory);

module.exports = router;
