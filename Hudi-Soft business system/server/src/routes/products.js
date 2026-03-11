const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getProducts)
    .post(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), auditLog('CREATE', 'PRODUCTS'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), auditLog('UPDATE', 'PRODUCTS'), updateProduct)
    .delete(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), auditLog('DELETE', 'PRODUCTS'), deleteProduct);

module.exports = router;
