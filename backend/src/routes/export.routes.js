/**
 * src/routes/export.routes.js
 */
const router = require('express').Router();
const { exportTransactions } = require('../controllers/export.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/v1/export/transactions — ADMIN + ANALYST only
router.get(
  '/transactions',
  authenticate,
  authorize('ADMIN', 'ANALYST'),
  exportTransactions
);

module.exports = router;
