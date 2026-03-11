const express = require('express');
const { getBranches, getBranch, createBranch, updateBranch, deleteBranch } = require('../controllers/branches');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('SUPER_ADMIN'), getBranches)
    .post(authorize('SUPER_ADMIN'), auditLog('CREATE', 'BRANCHES'), createBranch);

router.route('/:id')
    .get(getBranch)
    .put(authorize('SUPER_ADMIN', 'BRANCH_MANAGER'), auditLog('UPDATE', 'BRANCHES'), updateBranch)
    .delete(authorize('SUPER_ADMIN'), auditLog('DELETE', 'BRANCHES'), deleteBranch);

module.exports = router;
