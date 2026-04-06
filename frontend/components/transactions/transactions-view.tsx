'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Receipt,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TransactionModal } from './transaction-modal';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import {
  getTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
  exportTransactionsApi
} from '@/lib/api/transactions.api';
import type { Transaction, TransactionType, TransactionCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const categories: TransactionCategory[] = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 
  'Healthcare', 'Utilities', 'Salary', 'Investment', 'Other'
];

export function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({ total: 0, totalPages: 1 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getTransactionsApi({
        page,
        limit: 10,
        search: search || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      if (res.success) {
        // Map backend _id to frontend id
        const mapped = res.data.map((t: any) => ({
          ...t,
          id: t._id,
        }));
        setTransactions(mapped);
        setMeta(res.meta || { total: mapped.length, totalPages: 1 });
      }
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeFilter, categoryFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    try {
      const payload = {
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        note: data.note,
      };
      const res = await createTransactionApi(payload);
      if (res.success) {
        toast.success('Transaction added');
        setIsModalOpen(false);
        fetchTransactions(); // Refresh list
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add transaction');
    }
  };

  const handleEditTransaction = async (data: Partial<Transaction>) => {
    if (!editingTransaction) return;
    try {
      const payload = {
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        note: data.note,
      };
      const res = await updateTransactionApi(editingTransaction.id, payload);
      if (res.success) {
        toast.success('Transaction updated');
        setEditingTransaction(null);
        fetchTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    try {
      const res = await deleteTransactionApi(deletingTransaction.id);
      if (res.success) {
        toast.success('Transaction deleted');
        setDeletingTransaction(null);
        fetchTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete transaction');
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Starting download...');
      const response = await exportTransactionsApi({
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      // response is blob
      const url = window.URL.createObjectURL(new Blob([response as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export downloaded successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all financial transactions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-secondary/30 border-border/50 hover:bg-secondary/50"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90 hover:glow-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions... (Note)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 bg-secondary/30 border-border/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-[140px] bg-secondary/30 border-border/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-[140px] bg-secondary/30 border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
            </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Receipt className="w-8 h-8" />
                      <p>No transactions found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id} 
                    className="border-border/30 hover:bg-secondary/20 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        transaction.type === 'INCOME' 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-chart-4/20 text-chart-4'
                      )}>
                        {transaction.type === 'INCOME' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {transaction.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-lg bg-secondary/50 text-sm">
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {transaction.note || '-'}
                    </TableCell>
                    <TableCell className={cn(
                      'text-right font-semibold',
                      transaction.type === 'INCOME' ? 'text-accent' : 'text-chart-4'
                    )}>
                      {transaction.type === 'INCOME' ? '+' : '-'}$
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setDeletingTransaction(transaction)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */ }
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Total {meta.total} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-secondary/30"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {meta.totalPages || 1}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-secondary/30"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (meta.totalPages || 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen || !!editingTransaction}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
