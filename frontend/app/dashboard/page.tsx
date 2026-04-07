'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { SmartInsights } from '@/components/dashboard/smart-insights';
import { MonthlyTrendsChart } from '@/components/dashboard/monthly-trends-chart';
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TransactionsView } from '@/components/transactions/transactions-view';
import { UserManagementView } from '@/components/users/user-management-view';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  getSummaryApi,
  getSmartInsightsApi,
  getMonthlyTrendsApi,
  getCategoryBreakdownApi,
  getSpendingInsightsApi,
  getActivityFeedApi,
} from '@/lib/api/dashboard.api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type View = 'dashboard' | 'transactions' | 'users';

function DashboardContent() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = () => {
    logout();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const canViewAnalytics = user.role === 'ADMIN' || user.role === 'ANALYST';
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        onViewChange={setCurrentView}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            'hidden md:block sticky top-16 h-[calc(100vh-4rem)] glass-card border-r border-border/50 transition-all duration-300',
            isSidebarCollapsed ? 'w-16' : 'w-64'
          )}
        >
          <DashboardNav
            currentView={currentView}
            onViewChange={setCurrentView}
            userRole={user.role}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-card border-border/50">
            <DashboardNav
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                setIsMobileMenuOpen(false);
              }}
              userRole={user.role}
              isMobile
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {currentView === 'dashboard' && (
            <DashboardView
              canViewAnalytics={canViewAnalytics}
              isAdmin={isAdmin}
            />
          )}
          {currentView === 'transactions' && canViewAnalytics && (
             <TransactionsView />
          )}
          {currentView === 'users' && isAdmin && (
            <UserManagementView />
          )}
        </main>
      </div>
    </div>
  );
}

interface DashboardViewProps {
  canViewAnalytics: boolean;
  isAdmin: boolean;
}

const categoryColors: Record<string, string> = {
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

function DashboardView({ canViewAnalytics, isAdmin }: DashboardViewProps) {
  const [summary, setSummary] = useState<any>(null);
  const [smartInsights, setSmartInsights] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [spendingInsights, setSpendingInsights] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [sumRes, insightsRes] = await Promise.all([
          getSummaryApi(),
          getSmartInsightsApi(),
        ]);
        
        if (sumRes.success) setSummary(sumRes.data);
        
        if (insightsRes.success && insightsRes.data?.insights) {
          // Map string[] to SmartInsight object array expected by UI
          const mappedInsights = insightsRes.data.insights.map((msg: string, i: number) => {
             let type = 'info';
             let icon = 'Lightbulb';
             if (msg.includes('⚠️')) { type = 'warning'; icon = 'AlertTriangle'; }
             else if (msg.includes('🚨')) { type = 'alert'; icon = 'Bell'; }
             else if (msg.includes('📉') || msg.includes('✅')) { type = 'success'; icon = 'TrendingUp'; }
             
             // Strip emojis for clean text
             const cleanMsg = msg.replace(/[^a-zA-Z0-9 %.,!'$-]/g, '').trim();

             return { id: `insight-${i}`, type, icon, message: cleanMsg || msg };
          });
          setSmartInsights(mappedInsights);
        }

        if (canViewAnalytics) {
           const [trendsRes, catRes, spendRes] = await Promise.all([
             getMonthlyTrendsApi(),
             getCategoryBreakdownApi(),
             getSpendingInsightsApi(),
           ]);

           if (trendsRes.success) {
               const trends = trendsRes.data.map((t: any) => ({
                   month: t.month.split('-')[1], // Just take month number or map to name
                   income: t.income || 0,
                   expense: t.expense || 0,
               }));
               setMonthlyTrends(trends);
           }

           if (catRes.success) {
               const totalAmount = catRes.data.reduce((acc: number, cur: any) => acc + cur.total, 0);
               const cats = catRes.data.map((c: any) => ({
                   category: c.category,
                   amount: c.total,
                   percentage: totalAmount ? Math.round((c.total / totalAmount) * 100) : 0,
                   color: categoryColors[c.category] || categoryColors.Other,
               }));
               setCategoryBreakdown(cats);
           }

           if (spendRes.success) {
               const sd = spendRes.data;
               setSpendingInsights({
                   highestSpendingCategory: {
                       category: sd.highestCategory || 'N/A',
                       amount: sd.highestCategoryTotal || 0,
                   },
                   averageDailySpend: sd.avgDailySpend || 0,
                   anomalies: (sd.anomalies || []).map((a: any) => ({
                       id: a.id,
                       category: a.category,
                       message: `Unusual spending: $${a.amount} on ${a.date.split('T')[0]}`,
                       severity: a.amount > sd.anomalyThreshold * 1.5 ? 'high' : 'medium'
                   }))
               });
           }
        }

        if (isAdmin) {
          const actRes = await getActivityFeedApi(5);
          if (actRes.success) {
             const acts = actRes.data.map((a: any) => ({
                id: a._id || Math.random().toString(),
                amount: a.amount,
                type: a.type,
                category: a.category,
                date: a.createdAt,
                note: a.message,
                userId: 'system',
                userName: a.user,
                createdAt: a.createdAt,
             }));
             setRecentActivity(acts);
          }
        }

      } catch (error: any) {
         toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [canViewAnalytics, isAdmin]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      <SummaryCards summary={summary || { totalIncome: 0, totalExpenses: 0, netBalance: 0, incomeChange: 0, expenseChange: 0 }} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SmartInsights insights={smartInsights} isLoading={isLoading} />
        </div>

        {canViewAnalytics && (
          <div className="lg:col-span-2">
            <MonthlyTrendsChart data={monthlyTrends} isLoading={isLoading} />
          </div>
        )}
      </div>

      {canViewAnalytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryBreakdown data={categoryBreakdown} isLoading={isLoading} />
          <SpendingInsights data={spendingInsights || { highestSpendingCategory: {category: '', amount: 0}, averageDailySpend: 0, anomalies: [] }} isLoading={isLoading} />
        </div>
      )}

      {isAdmin && (
        <RecentActivity transactions={recentActivity} isLoading={isLoading} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
