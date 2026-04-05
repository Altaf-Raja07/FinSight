/**
 * src/controllers/dashboard.controller.js
 * Dashboard analytics controller with role-based response shaping
 */
const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(req.user._id, req.user.role);

    // VIEWER gets a simplified view
    if (req.user.role === 'VIEWER') {
      return sendSuccess(res, {
        message: 'Dashboard summary.',
        data: {
          netBalance: data.netBalance,
          totalIncome: data.totalIncome,
          totalExpenses: data.totalExpenses,
        },
      });
    }

    return sendSuccess(res, { message: 'Dashboard summary.', data });
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { type = 'EXPENSE' } = req.query;
    const data = await dashboardService.getCategoryBreakdown(req.user._id, req.user.role, type);
    return sendSuccess(res, { message: 'Category breakdown.', data });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends(req.user._id, req.user.role);
    return sendSuccess(res, { message: 'Monthly trends (last 12 months).', data });
  } catch (error) {
    next(error);
  }
};

const getSpendingInsights = async (req, res, next) => {
  try {
    const data = await dashboardService.getSpendingInsights(req.user._id, req.user.role);
    return sendSuccess(res, { message: 'Spending insights for current month.', data });
  } catch (error) {
    next(error);
  }
};

const getSmartInsights = async (req, res, next) => {
  try {
    const insights = await dashboardService.getSmartInsights(req.user._id, req.user.role);
    return sendSuccess(res, { message: 'Smart insights.', data: { insights } });
  } catch (error) {
    next(error);
  }
};

const getActivityFeed = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const data = await dashboardService.getActivityFeed(req.user._id, req.user.role, Number(limit));
    return sendSuccess(res, { message: 'Activity feed.', data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getSpendingInsights,
  getSmartInsights,
  getActivityFeed,
};
