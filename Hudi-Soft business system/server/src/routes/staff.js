const express = require('express');
const { addStaff, getStaffList, updateStaff, deleteStaff, getStaffMember } = require('../controllers/staff');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), getStaffList)
    .post(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), addStaff);

router.route('/:id')
    .get(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), getStaffMember)
    .put(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), updateStaff)
    .delete(authorize('BRANCH_MANAGER', 'SUPER_ADMIN'), deleteStaff);

module.exports = router;
