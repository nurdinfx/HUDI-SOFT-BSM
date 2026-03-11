const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/v1/audit
// @access  Private/Admin
exports.getAuditLogs = async (req, res, next) => {
    try {
        let query = {};

        // If not super admin, filter by branch
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        }

        const logs = await AuditLog.find(query)
            .populate('user', 'name role')
            .populate('branch', 'name')
            .sort('-createdAt')
            .limit(100);

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        next(err);
    }
};
