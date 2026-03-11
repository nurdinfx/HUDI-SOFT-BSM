const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settings');
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.route('/')
    .get(getSettings)
    .put(auditLog('UPDATE', 'SETTINGS'), updateSettings);

module.exports = router;
