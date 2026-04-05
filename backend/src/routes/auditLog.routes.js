/**
 * src/routes/auditLog.routes.js
 */
const router = require('express').Router();
const { getAuditLogs } = require('../controllers/auditLog.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/v1/audit-logs — ADMIN only
router.get('/', authenticate, authorize('ADMIN'), getAuditLogs);

module.exports = router;
