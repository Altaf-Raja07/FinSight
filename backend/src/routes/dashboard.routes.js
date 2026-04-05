/**
 * src/routes/dashboard.routes.js
 * Dashboard analytics routes with role-based access
 */
const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/v1/dashboard/summary — ALL roles (response shaped by role)
router.get('/summary', dashboardController.getSummary);

// GET /api/v1/dashboard/category-breakdown — ADMIN + ANALYST only
router.get(
  '/category-breakdown',
  authorize('ADMIN', 'ANALYST'),
  dashboardController.getCategoryBreakdown
);

// GET /api/v1/dashboard/monthly-trends — ADMIN + ANALYST only
router.get(
  '/monthly-trends',
  authorize('ADMIN', 'ANALYST'),
  dashboardController.getMonthlyTrends
);

// GET /api/v1/dashboard/spending-insights — ADMIN + ANALYST only
router.get(
  '/spending-insights',
  authorize('ADMIN', 'ANALYST'),
  dashboardController.getSpendingInsights
);

// GET /api/v1/dashboard/smart-insights — ALL roles (response shaped by role)
router.get('/smart-insights', dashboardController.getSmartInsights);

// GET /api/v1/dashboard/activity-feed — ADMIN only
router.get('/activity-feed', authorize('ADMIN'), dashboardController.getActivityFeed);

module.exports = router;
