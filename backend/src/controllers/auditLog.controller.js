/**
 * src/controllers/auditLog.controller.js
 * Audit log controller (ADMIN only)
 */
const auditLogService = require('../services/auditLog.service');
const { sendSuccess } = require('../utils/response');

const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, userId, action, entity } = req.query;
    const result = await auditLogService.getAuditLogs({ page, limit, userId, action, entity });

    return sendSuccess(res, {
      message: 'Audit logs retrieved.',
      data: result.logs,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };
