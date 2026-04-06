'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CategoryBreakdown as CategoryBreakdownType } from '@/lib/types';

interface CategoryBreakdownProps {
  data: CategoryBreakdownType[];
  isLoading?: boolean;
}

const COLORS = [
  'oklch(0.7 0.18 260)',
  'oklch(0.65 0.2 165)',
  'oklch(0.75 0.15 145)',
  'oklch(0.65 0.18 300)',
  'oklch(0.7 0.2 30)',
  'oklch(0.6 0.15 200)',
  'oklch(0.75 0.18 280)',
  'oklch(0.5 0.1 0)',
];

export function CategoryBreakdown({ data, isLoading }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-[400px] shimmer" />
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="amount"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${entry.category}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">${(total / 1000).toFixed(1)}k</span>
            <span className="text-xs text-muted-foreground">Total Spent</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <div
              key={item.category}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-default"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.category}</p>
                <p className="text-xs text-muted-foreground">
                  ${item.amount.toLocaleString()} ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryBreakdownType }> }) {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  return (
    <div className="glass-card rounded-lg p-3 border border-border/50 shadow-xl">
      <p className="text-sm font-medium">{data.category}</p>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className="text-xs text-muted-foreground">Amount</span>
        <span className="text-sm font-semibold text-primary">
          ${data.amount.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">Share</span>
        <span className="text-sm font-semibold">
          {data.percentage}%
        </span>
      </div>
    </div>
  );
}
