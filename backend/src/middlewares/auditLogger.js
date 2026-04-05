/**
 * src/middlewares/auditLogger.js
 * Middleware factory that auto-creates audit log entries
 * Usage: auditLog('CREATE_TRANSACTION', 'Transaction')
 */
const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry from request context
 * @param {string} action - Action name e.g. CREATE_TRANSACTION
 * @param {string} entity - Entity name e.g. 'Transaction'
 * @param {Function} [getEntityId] - Optional: fn(req, res_body) => ObjectId
 * @param {Function} [getMetadata] - Optional: fn(req) => {} extra context
 */
const auditLog = (action, entity, getEntityId = null, getMetadata = null) => {
  return async (req, res, next) => {
    // Intercept the response to capture the created entity ID
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      // Fire-and-forget audit log — don't block the response
      try {
        if (req.user) {
          const entityId = getEntityId ? getEntityId(req, body) : req.params?.id || null;
          const metadata = getMetadata ? getMetadata(req) : {};

          await AuditLog.create({
            userId: req.user._id,
            action,
            entity,
            entityId,
            metadata,
            ipAddress: req.ip,
          });
        }
      } catch (err) {
        // Audit log failure must never break the main request
        console.error('[AuditLog] Failed to write log:', err.message);
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
