const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.route('/')
    .get(getUsers)
    .post(auditLog('CREATE', 'USERS'), createUser);

router.route('/:id')
    .get(getUser)
    .put(auditLog('UPDATE', 'USERS'), updateUser)
    .delete(auditLog('DELETE', 'USERS'), deleteUser);

module.exports = router;
