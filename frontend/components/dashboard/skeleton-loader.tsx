'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('shimmer rounded-lg', className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
      <div className="h-16" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 h-64 pt-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1">
            <Skeleton 
              className="w-full rounded-t" 
              style={{ height: `${(i % 3 === 0 ? 60 : i % 2 === 0 ? 80 : 40)}%` }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="flex items-center justify-center py-8">
        <div className="relative">
          <Skeleton className="h-48 w-48 rounded-full" />
          <div className="absolute inset-8">
            <Skeleton className="h-full w-full rounded-full bg-background" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
