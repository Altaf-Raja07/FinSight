'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MonthlyTrend } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MonthlyTrendsChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

type ChartType = 'area' | 'bar';

export function MonthlyTrendsChart({ data, isLoading }: MonthlyTrendsChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-[400px] shimmer" />
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Monthly Trends</h3>
        </div>

        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 px-3 transition-all',
              chartType === 'area' && 'bg-primary/20 text-primary'
            )}
            onClick={() => setChartType('area')}
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 px-3 transition-all',
              chartType === 'bar' && 'bg-primary/20 text-primary'
            )}
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-4" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.2 165)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.65 0.2 165)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.025 260)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 260)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 260)', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="oklch(0.65 0.2 165)"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="oklch(0.65 0.18 300)"
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.025 260)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 260)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.6 0.02 260)', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="oklch(0.65 0.2 165)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="oklch(0.65 0.18 300)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null;

  return (
    <div className="glass-card rounded-lg p-3 border border-border/50 shadow-xl">
      <p className="text-sm font-medium mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground capitalize">{entry.dataKey}</span>
          <span className={cn(
            'text-sm font-semibold',
            entry.dataKey === 'income' ? 'text-accent' : 'text-chart-4'
          )}>
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
