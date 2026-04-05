/**
 * tests/dashboard.service.test.js
 * Unit tests for dashboard service utility functions
 */
const { generateSmartInsights, detectAnomalyThreshold } = require('../src/utils/insights');

describe('Insights Utilities', () => {
  // ─── detectAnomalyThreshold ───────────────────────────────────────────────
  describe('detectAnomalyThreshold', () => {
    it('should return zero threshold for empty array', () => {
      const result = detectAnomalyThreshold([]);
      expect(result.threshold).toBe(0);
      expect(result.mean).toBe(0);
    });

    it('should detect correct threshold for normal data', () => {
      // Mean = 100, stdDev = 0, threshold = 100
      const result = detectAnomalyThreshold([100, 100, 100, 100]);
      expect(result.mean).toBe(100);
      expect(result.stdDev).toBe(0);
      expect(result.threshold).toBe(100);
    });

    it('should flag large outlier amounts', () => {
      const amounts = [50, 60, 55, 58, 52, 1000]; // 1000 is an obvious anomaly
      const { threshold } = detectAnomalyThreshold(amounts);
      // 1000 should be far above the threshold
      expect(1000).toBeGreaterThan(threshold);
      // Small amounts should be below threshold
      expect(50).toBeLessThan(threshold);
    });
  });

  // ─── generateSmartInsights ────────────────────────────────────────────────
  describe('generateSmartInsights', () => {
    const baseParams = {
      currentMonth: { income: 5000, expense: 3500 },
      previousMonth: { income: 4500, expense: 2500 },
      categoryBreakdown: [
        { category: 'Food', total: 1500, type: 'EXPENSE' },
        { category: 'Transport', total: 500, type: 'EXPENSE' },
      ],
      spendingInsights: {
        highestCategory: 'Food',
        avgDailySpend: 113.33,
        anomalies: [],
      },
      role: 'ADMIN',
    };

    it('should return an array of insight strings', () => {
      const insights = generateSmartInsights(baseParams);
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      insights.forEach((i) => expect(typeof i).toBe('string'));
    });

    it('should detect overspending month-over-month', () => {
      const insights = generateSmartInsights(baseParams); // 3500 vs 2500 = +40%
      const overspendInsight = insights.find((i) => i.includes('more this month'));
      expect(overspendInsight).toBeTruthy();
    });

    it('should detect savings when net is positive', () => {
      const insights = generateSmartInsights(baseParams); // net = 1500
      const savingInsight = insights.find((i) => i.includes('saving'));
      expect(savingInsight).toBeTruthy();
    });

    it('should report anomaly count for ADMIN', () => {
      const params = {
        ...baseParams,
        spendingInsights: { ...baseParams.spendingInsights, anomalies: [{ amount: 5000 }, { amount: 3000 }] },
      };
      const insights = generateSmartInsights(params);
      const anomalyInsight = insights.find((i) => i.includes('2 unusually high'));
      expect(anomalyInsight).toBeTruthy();
    });

    it('should NOT report anomalies for VIEWER role', () => {
      const params = {
        ...baseParams,
        role: 'VIEWER',
        spendingInsights: { ...baseParams.spendingInsights, anomalies: [{ amount: 5000 }] },
      };
      const insights = generateSmartInsights(params);
      const anomalyInsight = insights.find((i) => i.includes('unusually high'));
      expect(anomalyInsight).toBeUndefined();
    });

    it('should return fallback message if no data', () => {
      const insights = generateSmartInsights({
        currentMonth: null,
        previousMonth: null,
        categoryBreakdown: [],
        spendingInsights: { highestCategory: null, avgDailySpend: null, anomalies: [] },
        role: 'VIEWER',
      });
      expect(insights[0]).toContain('No significant insights');
    });
  });
});
