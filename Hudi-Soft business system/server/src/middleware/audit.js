const AuditLog = require('../models/AuditLog');

/**
 * @desc    Audit logging middleware
 * @param   {String} action - The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param   {String} module - The module affected (e.g., 'SALES', 'INVENTORY')
 */
const auditLog = (action, module) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            res.send = originalSend;

            // Only log successful operations and non-GET requests (or specific ones)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.method !== 'GET') {
                const logEntry = {
                    user: req.user ? req.user.id : null,
                    action: action || req.method,
                    module: module || req.baseUrl.split('/').pop(),
                    details: {
                        path: req.originalUrl,
                        body: req.body,
                        params: req.params,
                        query: req.query
                    },
                    ipAddress: req.ip,
                    branch: req.user ? req.user.branch : null
                };

                AuditLog.create(logEntry).catch(err => console.error('Audit Log Error:', err));
            }

            return res.send(data);
        };

        next();
    };
};

module.exports = auditLog;
