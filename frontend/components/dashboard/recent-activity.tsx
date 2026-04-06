'use client';

import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function RecentActivity({ transactions, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-[400px] shimmer" />
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <span className="text-xs text-muted-foreground">Last 24 hours</span>
      </div>

      <ScrollArea className="h-[320px] pr-4">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === 'INCOME';
  const initials = transaction.userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const timeAgo = formatDistanceToNow(new Date(transaction.createdAt || transaction.date || new Date()), { addSuffix: true });

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
      <Avatar className="h-10 w-10 border border-border/50">
        <AvatarImage src={transaction.userAvatar} alt={transaction.userName} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{transaction.userName}</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            isIncome 
              ? 'bg-accent/20 text-accent' 
              : 'bg-chart-4/20 text-chart-4'
          )}>
            {transaction.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {transaction.note || 'No description'}
        </p>
      </div>

      <div className="text-right shrink-0">
        <div className={cn(
          'flex items-center gap-1 text-sm font-semibold',
          isIncome ? 'text-accent' : 'text-chart-4'
        )}>
          {isIncome ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
}
