import type {
  User,
  Transaction,
  DashboardSummary,
  MonthlyTrend,
  CategoryBreakdown,
  SmartInsight,
  SpendingInsights,
  TransactionCategory,
} from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex@financeflow.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@financeflow.com',
    role: 'ANALYST',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james@financeflow.com',
    role: 'VIEWER',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    joinedAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@financeflow.com',
    role: 'ANALYST',
    status: 'INACTIVE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    joinedAt: '2024-01-25',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@financeflow.com',
    role: 'VIEWER',
    status: 'ACTIVE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    joinedAt: '2024-04-05',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 5200,
    type: 'INCOME',
    category: 'Salary',
    date: '2026-04-01',
    note: 'Monthly salary',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 't2',
    amount: 1500,
    type: 'EXPENSE',
    category: 'Housing',
    date: '2026-04-02',
    note: 'Rent payment',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2026-04-02T10:30:00Z',
  },
  {
    id: 't3',
    amount: 250,
    type: 'EXPENSE',
    category: 'Food',
    date: '2026-04-03',
    note: 'Grocery shopping',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2026-04-03T14:15:00Z',
  },
  {
    id: 't4',
    amount: 800,
    type: 'INCOME',
    category: 'Investment',
    date: '2026-04-04',
    note: 'Dividend payment',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2026-04-04T11:00:00Z',
  },
  {
    id: 't5',
    amount: 120,
    type: 'EXPENSE',
    category: 'Transport',
    date: '2026-04-05',
    note: 'Gas and parking',
    userId: '3',
    userName: 'James Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    createdAt: '2026-04-05T08:45:00Z',
  },
  {
    id: 't6',
    amount: 450,
    type: 'EXPENSE',
    category: 'Shopping',
    date: '2026-04-05',
    note: 'New electronics',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2026-04-05T16:20:00Z',
  },
  {
    id: 't7',
    amount: 180,
    type: 'EXPENSE',
    category: 'Utilities',
    date: '2026-04-06',
    note: 'Electric bill',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2026-04-06T09:30:00Z',
  },
  {
    id: 't8',
    amount: 95,
    type: 'EXPENSE',
    category: 'Entertainment',
    date: '2026-04-06',
    note: 'Concert tickets',
    userId: '4',
    userName: 'Emily Davis',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    createdAt: '2026-04-06T19:00:00Z',
  },
  {
    id: 't9',
    amount: 320,
    type: 'EXPENSE',
    category: 'Healthcare',
    date: '2026-04-07',
    note: 'Doctor visit',
    userId: '5',
    userName: 'Michael Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    createdAt: '2026-04-07T11:15:00Z',
  },
  {
    id: 't10',
    amount: 2000,
    type: 'INCOME',
    category: 'Investment',
    date: '2026-04-07',
    note: 'Stock sale profit',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2026-04-07T15:45:00Z',
  },
];

// Mock Dashboard Summary
export const mockDashboardSummary: DashboardSummary = {
  totalIncome: 48500,
  totalExpenses: 28750,
  netBalance: 19750,
  incomeChange: 12.5,
  expenseChange: -8.3,
};

// Mock Monthly Trends (Last 12 months)
export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'May', income: 4200, expense: 3100 },
  { month: 'Jun', income: 4500, expense: 3400 },
  { month: 'Jul', income: 4800, expense: 2900 },
  { month: 'Aug', income: 5100, expense: 3200 },
  { month: 'Sep', income: 4900, expense: 3600 },
  { month: 'Oct', income: 5200, expense: 2800 },
  { month: 'Nov', income: 5500, expense: 3100 },
  { month: 'Dec', income: 6200, expense: 4500 },
  { month: 'Jan', income: 5800, expense: 3300 },
  { month: 'Feb', income: 5400, expense: 2900 },
  { month: 'Mar', income: 5900, expense: 3200 },
  { month: 'Apr', income: 6000, expense: 2750 },
];

// Mock Category Breakdown
const categoryColors: Record<TransactionCategory, string> = {
  Food: 'hsl(var(--chart-1))',
  Transport: 'hsl(var(--chart-2))',
  Housing: 'hsl(var(--chart-3))',
  Entertainment: 'hsl(var(--chart-4))',
  Shopping: 'hsl(var(--chart-5))',
  Healthcare: 'hsl(200, 70%, 50%)',
  Utilities: 'hsl(280, 70%, 50%)',
  Salary: 'hsl(120, 70%, 50%)',
  Investment: 'hsl(45, 70%, 50%)',
  Other: 'hsl(0, 0%, 50%)',
};

export const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: 'Housing', amount: 1500, percentage: 35, color: categoryColors.Housing },
  { category: 'Food', amount: 650, percentage: 15, color: categoryColors.Food },
  { category: 'Shopping', amount: 520, percentage: 12, color: categoryColors.Shopping },
  { category: 'Transport', amount: 430, percentage: 10, color: categoryColors.Transport },
  { category: 'Utilities', amount: 380, percentage: 9, color: categoryColors.Utilities },
  { category: 'Healthcare', amount: 350, percentage: 8, color: categoryColors.Healthcare },
  { category: 'Entertainment', amount: 290, percentage: 7, color: categoryColors.Entertainment },
  { category: 'Other', amount: 180, percentage: 4, color: categoryColors.Other },
];

// Mock Smart Insights
export const mockSmartInsights: SmartInsight[] = [
  {
    id: 'i1',
    type: 'success',
    icon: 'TrendingUp',
    message: 'Great job! Your savings rate is 40% this month, up from 35% last month.',
  },
  {
    id: 'i2',
    type: 'warning',
    icon: 'AlertTriangle',
    message: 'Heads up! Your food spending is 30% higher than your 3-month average.',
  },
  {
    id: 'i3',
    type: 'info',
    icon: 'Lightbulb',
    message: 'You could save $200/month by reducing entertainment expenses to the industry average.',
  },
  {
    id: 'i4',
    type: 'alert',
    icon: 'Bell',
    message: 'Your utility bill is due in 3 days. Auto-pay is not enabled.',
  },
];

// Mock Spending Insights
export const mockSpendingInsights: SpendingInsights = {
  highestSpendingCategory: {
    category: 'Housing',
    amount: 1500,
  },
  averageDailySpend: 95.83,
  anomalies: [
    {
      id: 'a1',
      category: 'Food',
      message: 'Unusual spending spike detected on Apr 3',
      severity: 'medium',
    },
    {
      id: 'a2',
      category: 'Shopping',
      message: 'Category spending 45% above normal',
      severity: 'high',
    },
  ],
};

// Sparkline data for summary cards
export const mockSparklineData = {
  income: [4200, 4500, 4800, 5100, 4900, 5200, 5500, 6200, 5800, 5400, 5900, 6000],
  expense: [3100, 3400, 2900, 3200, 3600, 2800, 3100, 4500, 3300, 2900, 3200, 2750],
  balance: [1100, 1100, 1900, 1900, 1300, 2400, 2400, 1700, 2500, 2500, 2700, 3250],
};
