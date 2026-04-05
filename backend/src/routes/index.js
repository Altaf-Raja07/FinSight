/**
 * src/routes/index.js
 * Master router — mounts all sub-routers under versioned prefix
 */
const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/transactions', require('./transaction.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/export', require('./export.routes'));
router.use('/audit-logs', require('./auditLog.routes'));

module.exports = router;
