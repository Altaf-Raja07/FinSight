'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction, TransactionType, TransactionCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => void;
  transaction?: Transaction | null;
}

const categories: TransactionCategory[] = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 
  'Healthcare', 'Utilities', 'Salary', 'Investment', 'Other'
];

export function TransactionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction 
}: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<TransactionCategory>('Other');
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setDate(new Date(transaction.date));
      setNote(transaction.note || '');
    } else {
      setAmount('');
      setType('EXPENSE');
      setCategory('Other');
      setDate(new Date());
      setNote('');
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) return;

    onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      date: format(date, 'yyyy-MM-dd'),
      note: note.trim() || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass border-border/50">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the transaction details below.'
              : 'Enter the details for the new transaction.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Transaction Type Toggle */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'h-12 gap-2 transition-all',
                  type === 'INCOME'
                    ? 'bg-accent/20 border-accent/50 text-accent hover:bg-accent/30'
                    : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                )}
                onClick={() => setType('INCOME')}
              >
                <ArrowUpRight className="w-4 h-4" />
                Income
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'h-12 gap-2 transition-all',
                  type === 'EXPENSE'
                    ? 'bg-chart-4/20 border-chart-4/50 text-chart-4 hover:bg-chart-4/30'
                    : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                )}
                onClick={() => setType('EXPENSE')}
              >
                <ArrowDownRight className="w-4 h-4" />
                Expense
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-12 bg-secondary/30 border-border/50 text-lg font-semibold"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
              <SelectTrigger className="h-12 bg-secondary/30 border-border/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-12 justify-start text-left font-normal bg-secondary/30 border-border/50',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a description..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-secondary/30 border-border/50 resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-secondary/30 border-border/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90"
            >
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
