/**
 * src/services/dashboard.service.js
 * Advanced analytics service using MongoDB aggregation pipelines
 * All heavy computation is pushed to the DB — no in-memory number crunching
 */
const Transaction = require('../models/Transaction');
const cacheUtil = require('../utils/cache');
const { generateSmartInsights, detectAnomalyThreshold } = require('../utils/insights');

/**
 * Build a base match stage for aggregation
 * Scopes queries correctly by role
 */
const buildBaseMatch = (userId, role, extraFilters = {}) => {
  const match = { isDeleted: false, ...extraFilters };
  if (role !== 'ADMIN') {
    match.userId = require('mongoose').Types.ObjectId.createFromHexString
      ? require('mongoose').Types.ObjectId.createFromHexString(userId.toString())
      : require('mongoose').Types.ObjectId(userId.toString());
  }
  return match;
};

/**
 * 1. Summary: Total income, total expenses, net balance
 */
const getSummary = async (userId, role) => {
  const cacheKey = `dashboard:${userId}:summary`;
  const cached = cacheUtil.get(cacheKey);
  if (cached) return cached;

  const match = buildBaseMatch(userId, role);

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const income = result.find((r) => r._id === 'INCOME') || { total: 0, count: 0 };
  const expense = result.find((r) => r._id === 'EXPENSE') || { total: 0, count: 0 };

  const summary = {
    totalIncome: income.total,
    totalExpenses: expense.total,
    netBalance: income.total - expense.total,
    transactionCount: income.count + expense.count,
  };

  cacheUtil.set(cacheKey, summary);
  return summary;
};

/**
 * 2. Category breakdown: Sum of expenses grouped by category
 */
const getCategoryBreakdown = async (userId, role, type = 'EXPENSE') => {
  const cacheKey = `dashboard:${userId}:category:${type}`;
  const cached = cacheUtil.get(cacheKey);
  if (cached) return cached;

  const match = buildBaseMatch(userId, role, { type });

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        total: 1,
        count: 1,
      },
    },
  ]);

  cacheUtil.set(cacheKey, result);
  return result;
};

/**
 * 3. Monthly trends: Income vs expense per month for the past 12 months
 */
const getMonthlyTrends = async (userId, role) => {
  const cacheKey = `dashboard:${userId}:monthly-trends`;
  const cached = cacheUtil.get(cacheKey);
  if (cached) return cached;

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const match = buildBaseMatch(userId, role, { date: { $gte: twelveMonthsAgo } });

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Transform into a clean monthly structure
  const monthMap = {};
  result.forEach(({ _id, total }) => {
    const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
    if (!monthMap[key]) {
      monthMap[key] = { month: key, year: _id.year, monthNum: _id.month, income: 0, expense: 0 };
    }
    if (_id.type === 'INCOME') monthMap[key].income = total;
    if (_id.type === 'EXPENSE') monthMap[key].expense = total;
  });

  const trends = Object.values(monthMap).map((m) => ({
    ...m,
    net: m.income - m.expense,
  }));

  cacheUtil.set(cacheKey, trends);
  return trends;
};

/**
 * 4. Spending Insights: Highest category, avg daily spend, anomaly detection
 */
const getSpendingInsights = async (userId, role) => {
  const cacheKey = `dashboard:${userId}:spending-insights`;
  const cached = cacheUtil.get(cacheKey);
  if (cached) return cached;

  // Current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const match = buildBaseMatch(userId, role, {
    type: 'EXPENSE',
    date: { $gte: startOfMonth },
  });

  const [categoryData, dailyData, allExpenses] = await Promise.all([
    // Highest spending category
    Transaction.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
    // Daily averages
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          dailyTotal: { $sum: '$amount' },
        },
      },
    ]),
    // All individual expense amounts for anomaly detection
    Transaction.find(match).select('amount date category note'),
  ]);

  const highestCategory = categoryData[0]?._id || null;
  const highestCategoryTotal = categoryData[0]?.total || 0;

  const dayCount = dailyData.length;
  const totalSpend = dailyData.reduce((sum, d) => sum + d.dailyTotal, 0);
  const avgDailySpend = dayCount > 0 ? totalSpend / dayCount : 0;

  // Statistical anomaly detection (>2 std dev)
  const amounts = allExpenses.map((e) => e.amount);
  const { threshold } = detectAnomalyThreshold(amounts);
  const anomalies = allExpenses
    .filter((e) => e.amount > threshold && threshold > 0)
    .map((e) => ({
      id: e._id,
      amount: e.amount,
      category: e.category,
      date: e.date,
      note: e.note,
      threshold: parseFloat(threshold.toFixed(2)),
    }));

  const insights = {
    highestCategory,
    highestCategoryTotal,
    avgDailySpend: parseFloat(avgDailySpend.toFixed(2)),
    daysTracked: dayCount,
    anomalies,
    anomalyThreshold: parseFloat(threshold.toFixed(2)),
  };

  cacheUtil.set(cacheKey, insights);
  return insights;
};

/**
 * 5. Smart Insights: Human-readable financial observations
 */
const getSmartInsights = async (userId, role) => {
  const cacheKey = `dashboard:${userId}:smart-insights`;
  const cached = cacheUtil.get(cacheKey);
  if (cached) return cached;

  const now = new Date();

  // Current month
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // Previous month
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const currentMonthMatch = buildBaseMatch(userId, role, { date: { $gte: startOfCurrentMonth } });
  const prevMonthMatch = buildBaseMatch(userId, role, {
    date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
  });

  const [currentData, prevData, categoryBreakdown, spendingInsights] = await Promise.all([
    Transaction.aggregate([
      { $match: currentMonthMatch },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: prevMonthMatch },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    getCategoryBreakdown(userId, role),
    getSpendingInsights(userId, role),
  ]);

  const parseMonthData = (data) => ({
    income: data.find((d) => d._id === 'INCOME')?.total || 0,
    expense: data.find((d) => d._id === 'EXPENSE')?.total || 0,
  });

  const insights = generateSmartInsights({
    currentMonth: parseMonthData(currentData),
    previousMonth: parseMonthData(prevData),
    categoryBreakdown,
    spendingInsights,
    role,
  });

  cacheUtil.set(cacheKey, insights);
  return insights;
};

/**
 * 6. Activity Feed: Recent audit-log-style transaction actions
 */
const getActivityFeed = async (userId, role, limit = 20) => {
  const query = { isDeleted: false };
  if (role !== 'ADMIN') query.userId = userId;

  const recent = await Transaction.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);

  return recent.map((t) => ({
    message: `${t.userId.name} ${t.type === 'INCOME' ? 'received' : 'spent'} ₹${t.amount} on ${t.category}`,
    amount: t.amount,
    type: t.type,
    category: t.category,
    user: t.userId.name,
    date: t.date,
    createdAt: t.createdAt,
  }));
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getSpendingInsights,
  getSmartInsights,
  getActivityFeed,
};
