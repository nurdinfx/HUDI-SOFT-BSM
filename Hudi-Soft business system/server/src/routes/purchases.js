const express = require('express');
const { createPurchase, receiveGoods, getPurchases, getPurchase, updatePurchase, deletePurchase } = require('../controllers/purchases');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPurchases)
    .post(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), createPurchase);

router.route('/:id')
    .get(getPurchase)
    .put(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), updatePurchase)
    .delete(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), deletePurchase);

router.route('/:id/receive')
    .put(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), receiveGoods);

module.exports = router;
