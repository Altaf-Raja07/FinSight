'use client';

import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { DashboardSummary } from '@/lib/types';
import { mockSparklineData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: DashboardSummary;
  isLoading?: boolean;
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Income',
      value: summary?.totalIncome || 0,
      change: summary?.incomeChange || 0,
      icon: DollarSign,
      sparklineData: mockSparklineData.income,
      gradient: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/20',
      iconColor: 'text-accent',
      changeColor: (summary?.incomeChange || 0) >= 0 ? 'text-accent' : 'text-destructive',
    },
    {
      title: 'Total Expenses',
      value: summary?.totalExpenses || 0,
      change: summary?.expenseChange || 0,
      icon: CreditCard,
      sparklineData: mockSparklineData.expense,
      gradient: 'from-chart-4/20 to-chart-4/5',
      iconBg: 'bg-chart-4/20',
      iconColor: 'text-chart-4',
      changeColor: (summary?.expenseChange || 0) <= 0 ? 'text-accent' : 'text-destructive',
    },
    {
      title: 'Net Balance',
      value: summary?.netBalance || 0,
      change: (((summary?.netBalance || 0) / (summary?.totalIncome || 1)) * 100) || 0,
      icon: Wallet,
      sparklineData: mockSparklineData.balance,
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
      changeColor: (summary?.netBalance || 0) >= 0 ? 'text-accent' : 'text-destructive',
      isBalance: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  sparklineData: number[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  changeColor: string;
  isBalance?: boolean;
}

function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  sparklineData,
  gradient,
  iconBg,
  iconColor,
  changeColor,
  isBalance,
}: SummaryCardProps) {
  const chartData = sparklineData.map((val, index) => ({ value: val, index }));
  const isPositive = change >= 0;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
      'glass-card hover:scale-[1.02] hover:glow-border-primary',
      'group cursor-default'
    )}>
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        gradient
      )} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
            iconBg
          )}>
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-3xl font-bold tracking-tight">
            ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h3>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className={cn('w-4 h-4', changeColor)} />
            ) : (
              <TrendingDown className={cn('w-4 h-4', changeColor)} />
            )}
            <span className={cn('text-sm font-medium', changeColor)}>
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">
              {isBalance ? 'savings rate' : 'vs last month'}
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
              className={iconColor}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
