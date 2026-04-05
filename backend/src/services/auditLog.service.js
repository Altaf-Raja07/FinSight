/**
 * src/services/auditLog.service.js
 * Query audit logs with pagination and filters
 */
const AuditLog = require('../models/AuditLog');

/**
 * Get paginated audit logs
 * @param {{ page, limit, userId, action, entity }} filters
 */
const getAuditLogs = async ({ page = 1, limit = 20, userId, action, entity } = {}) => {
  const query = {};
  if (userId) query.userId = userId;
  if (action) query.action = { $regex: action, $options: 'i' };
  if (entity) query.entity = entity;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Create an audit log entry programmatically (non-middleware path)
 */
const createAuditLog = async ({ userId, action, entity, entityId, metadata, ipAddress }) => {
  return AuditLog.create({ userId, action, entity, entityId, metadata, ipAddress });
};

module.exports = { getAuditLogs, createAuditLog };
