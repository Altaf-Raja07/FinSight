'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, LogOut, Menu, Bell, Settings, Moon, Sun, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { getActivityFeedApi, getSmartInsightsApi } from '@/lib/api/dashboard.api';
import { exportTransactionsApi } from '@/lib/api/transactions.api';
import { toast } from 'sonner';
import type { User } from '@/lib/types';

type View = 'dashboard' | 'transactions' | 'users';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  onMenuToggle?: () => void;
  onViewChange?: (view: View) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  view: View;
  read: boolean;
}

const roleColors = {
  ADMIN: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  ANALYST: 'bg-accent/20 text-accent border-accent/30',
  VIEWER: 'bg-primary/20 text-primary border-primary/30',
};

export function DashboardHeader({ user, onLogout, onMenuToggle, onViewChange }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      setLoadingNotifications(true);
      try {
        if (user.role === 'ADMIN') {
          const activity = await getActivityFeedApi(5);
          if (activity.success) {
            const mapped = activity.data.map((item: any, index: number) => ({
              id: item.id || item._id || `activity-${index}`,
              title: `${item.type === 'INCOME' ? 'Income' : 'Expense'}: $${item.amount}`,
              description: item.message || `${item.category} activity recorded`,
              view: 'dashboard' as View,
              read: false,
            }));
            setNotifications(mapped);
            return;
          }
        }

        const insights = await getSmartInsightsApi();
        if (insights.success) {
          const mapped = insights.data.insights.slice(0, 5).map((text: string, index: number) => ({
            id: `insight-${index}`,
            title: 'Smart Insight',
            description: text,
            view: 'dashboard' as View,
            read: false,
          }));
          setNotifications(mapped);
        }
      } catch {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, [user.role]);

  const openNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    onViewChange?.(item.view);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleExport = async () => {
    if (user.role === 'VIEWER') {
      toast.error('Export is available for Admin and Analyst roles only');
      return;
    }

    try {
      const response = await exportTransactionsApi({});
      const blob = response instanceof Blob ? response : new Blob([response as any]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV export downloaded');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight">FinanceFlow</span>
              <span className="text-xs text-muted-foreground block">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-secondary/50"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 glass border-border/50">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={markAllAsRead}
              >
                Mark all as read
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              {loadingNotifications && (
                <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
              )}
              {!loadingNotifications && notifications.length === 0 && (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
              )}
              {!loadingNotifications && notifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="cursor-pointer flex flex-col items-start gap-1"
                  onClick={() => openNotification(item)}
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">{item.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-secondary/50"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass border-border/50">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onViewChange?.(user.role === 'ADMIN' ? 'users' : 'dashboard')}
              >
                <Settings className="mr-2 h-4 w-4" />
                {user.role === 'ADMIN' ? 'User management' : 'Account overview'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleExport}
                disabled={user.role === 'VIEWER'}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-secondary/50"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-border/50">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-secondary/50"
                onClick={() => onViewChange?.(user.role === 'ADMIN' ? 'users' : 'dashboard')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
