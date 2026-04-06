'use client';

import { AlertCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import type { SpendingInsights as SpendingInsightsType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpendingInsightsProps {
  data: SpendingInsightsType;
  isLoading?: boolean;
}

const severityStyles = {
  low: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: 'text-primary',
  },
  medium: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: 'text-warning',
  },
  high: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: 'text-destructive',
  },
};

export function SpendingInsights({ data, isLoading }: SpendingInsightsProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full shimmer" />
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Spending Analysis</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Highest Category */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/5 border border-chart-4/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-chart-4" />
            <span className="text-xs text-muted-foreground">Highest Category</span>
          </div>
          <p className="text-lg font-bold text-chart-4">
            {data.highestSpendingCategory.category}
          </p>
          <p className="text-sm text-muted-foreground">
            ${data.highestSpendingCategory.amount.toLocaleString()}
          </p>
        </div>

        {/* Daily Average */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Daily Average</span>
          </div>
          <p className="text-lg font-bold text-primary">
            ${data.averageDailySpend.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">per day</p>
        </div>
      </div>

      {/* Anomalies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          <h4 className="text-sm font-medium">Spending Anomalies</h4>
        </div>

        {data.anomalies.length === 0 ? (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
            <p className="text-sm text-accent">No anomalies detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.anomalies.map((anomaly) => {
              const styles = severityStyles[anomaly.severity];
              return (
                <div
                  key={anomaly.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border transition-all',
                    styles.bg,
                    styles.border
                  )}
                >
                  <AlertTriangle className={cn('w-4 h-4 mt-0.5 shrink-0', styles.icon)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{anomaly.category}</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                        anomaly.severity === 'high' && 'bg-destructive/20 text-destructive',
                        anomaly.severity === 'medium' && 'bg-warning/20 text-warning',
                        anomaly.severity === 'low' && 'bg-primary/20 text-primary'
                      )}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{anomaly.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
