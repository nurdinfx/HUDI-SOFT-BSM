const express = require('express');
const { getAuditLogs } = require('../controllers/audit');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'BRANCH_MANAGER'));

router.get('/', getAuditLogs);

module.exports = router;
