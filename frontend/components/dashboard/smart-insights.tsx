'use client';

import { TrendingUp, AlertTriangle, Lightbulb, Bell, Info, CheckCircle, AlertCircle } from 'lucide-react';
import type { SmartInsight } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SmartInsightsProps {
  insights: SmartInsight[];
  isLoading?: boolean;
}

const iconMap = {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Bell,
  Info,
  CheckCircle,
  AlertCircle,
};

const typeStyles = {
  success: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    iconBg: 'bg-accent/20',
    iconColor: 'text-accent',
    hoverBorder: 'hover:border-accent/40',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    iconBg: 'bg-warning/20',
    iconColor: 'text-warning',
    hoverBorder: 'hover:border-warning/40',
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    hoverBorder: 'hover:border-primary/40',
  },
  alert: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    iconBg: 'bg-destructive/20',
    iconColor: 'text-destructive',
    hoverBorder: 'hover:border-destructive/40',
  },
};

export function SmartInsights({ insights, isLoading }: SmartInsightsProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="h-6 w-32 shimmer rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Smart Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const IconComponent = iconMap[insight.icon as keyof typeof iconMap] || Info;
          const styles = typeStyles[insight.type];

          return (
            <div
              key={insight.id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
                styles.bg,
                styles.border,
                styles.hoverBorder,
                'cursor-default'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                styles.iconBg
              )}>
                <IconComponent className={cn('w-5 h-5', styles.iconColor)} />
              </div>
              <p className="text-sm leading-relaxed pt-2">{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
