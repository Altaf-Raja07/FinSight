/**
 * src/utils/insights.js
 * Smart insight generators for the dashboard
 * Produces human-readable financial observations from raw aggregation data
 */

/**
 * Generate smart textual insights from dashboard data
 * @param {Object} params
 * @param {Object} params.currentMonth - { income, expense } for current month
 * @param {Object} params.previousMonth - { income, expense } for previous month
 * @param {Array}  params.categoryBreakdown - [{ category, total }]
 * @param {Object} params.spendingInsights - { highestCategory, avgDailySpend, anomalies }
 * @param {string} params.role - User role for response shaping
 * @returns {string[]} Array of insight messages
 */
const generateSmartInsights = ({
  currentMonth,
  previousMonth,
  categoryBreakdown,
  spendingInsights,
  role,
}) => {
  const insights = [];

  // Insight 1: Month-over-month expense change
  if (previousMonth && previousMonth.expense > 0 && currentMonth) {
    const expenseChange =
      ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100;

    if (expenseChange > 5) {
      insights.push(
        `📈 You spent ${Math.abs(expenseChange.toFixed(1))}% more this month compared to last month.`
      );
    } else if (expenseChange < -5) {
      insights.push(
        `📉 Great job! You spent ${Math.abs(expenseChange.toFixed(1))}% less this month compared to last month.`
      );
    } else {
      insights.push(`🔄 Your spending this month is similar to last month.`);
    }
  }

  // Insight 2: Highest spending category
  if (spendingInsights?.highestCategory) {
    insights.push(
      `🏆 "${spendingInsights.highestCategory}" is your highest expense category this period.`
    );
  }

  // Insight 3: Average daily spend
  if (spendingInsights?.avgDailySpend != null) {
    insights.push(
      `📅 Your average daily spending is ₹${spendingInsights.avgDailySpend.toFixed(2)}.`
    );
  }

  // Insight 4: Net balance health (available to all roles)
  if (currentMonth) {
    const net = currentMonth.income - currentMonth.expense;
    if (net > 0) {
      insights.push(`✅ You are saving ₹${net.toFixed(2)} this month. Keep it up!`);
    } else if (net < 0) {
      insights.push(
        `⚠️ You are overspending by ₹${Math.abs(net).toFixed(2)} this month. Consider reviewing your expenses.`
      );
    }
  }

  // Insight 5: Anomaly warnings (ADMIN/ANALYST only)
  if (['ADMIN', 'ANALYST'].includes(role) && spendingInsights?.anomalies?.length > 0) {
    const anomalyCount = spendingInsights.anomalies.length;
    insights.push(
      `🚨 ${anomalyCount} unusually high expense${anomalyCount > 1 ? 's' : ''} detected this period.`
    );
  }

  // Insight 6: Income source diversity (ADMIN/ANALYST only)
  if (['ADMIN', 'ANALYST'].includes(role) && categoryBreakdown) {
    const incomeCategories = categoryBreakdown.filter((c) => c.type === 'INCOME');
    if (incomeCategories.length > 1) {
      insights.push(`💼 You have income from ${incomeCategories.length} different sources this month.`);
    }
  }

  return insights.length > 0 ? insights : ['No significant insights available for this period.'];
};

/**
 * Detect spending anomalies
 * A transaction is flagged if its amount is more than 2 standard deviations above the mean
 * @param {number[]} amounts - Array of expense amounts
 * @returns {{ mean: number, stdDev: number, threshold: number }}
 */
const detectAnomalyThreshold = (amounts) => {
  if (!amounts || amounts.length === 0) return { mean: 0, stdDev: 0, threshold: 0 };

  const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
  const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  const threshold = mean + 2 * stdDev;

  return { mean, stdDev, threshold };
};

module.exports = { generateSmartInsights, detectAnomalyThreshold };
