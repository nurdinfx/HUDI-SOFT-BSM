const AuditLog = require('../models/AuditLog');

const logActivity = async (userId, action, module, details, branchId, ip) => {
    try {
        await AuditLog.create({
            user: userId,
            action,
            module,
            details,
            branch: branchId,
            ipAddress: ip
        });
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};

module.exports = logActivity;
