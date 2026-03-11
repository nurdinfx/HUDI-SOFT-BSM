const express = require('express');
const { getInventory, getInventoryItem, updateStock, initializeInventory } = require('../controllers/inventory');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getInventory)
    .post(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), auditLog('INITIALIZE', 'INVENTORY'), initializeInventory);

router.route('/:id')
    .get(getInventoryItem)
    .put(authorize('STOCK_MANAGER', 'SUPER_ADMIN'), auditLog('ADJUST', 'INVENTORY'), updateStock);

module.exports = router;
