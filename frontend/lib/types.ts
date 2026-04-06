// User and Authentication Types
export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Transaction Types
export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Housing' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Healthcare' 
  | 'Utilities' 
  | 'Salary' 
  | 'Investment' 
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note?: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
}

// Dashboard Types
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeChange: number;
  expenseChange: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface SmartInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  icon: string;
  message: string;
}

export interface SpendingAnomaly {
  id: string;
  category: TransactionCategory;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SpendingInsights {
  highestSpendingCategory: {
    category: TransactionCategory;
    amount: number;
  };
  averageDailySpend: number;
  anomalies: SpendingAnomaly[];
}

// Filter Types
export interface TransactionFilters {
  search: string;
  type: TransactionType | 'ALL';
  category: TransactionCategory | 'ALL';
  dateFrom: string;
  dateTo: string;
}
