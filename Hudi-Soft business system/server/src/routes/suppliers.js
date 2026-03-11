const express = require('express');
const { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/suppliers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSuppliers)
    .post(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), createSupplier);

router.route('/:id')
    .get(getSupplier)
    .put(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), updateSupplier)
    .delete(authorize('SUPER_ADMIN'), deleteSupplier);

module.exports = router;
