const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenses');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getExpenses)
    .post(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), createExpense);

router.route('/:id')
    .put(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), updateExpense)
    .delete(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), deleteExpense);

module.exports = router;
