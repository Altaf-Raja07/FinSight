'use client';

import { Activity, LogOut, Menu, Bell, Settings } from 'lucide-react';
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
import type { User } from '@/lib/types';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  onMenuToggle?: () => void;
}

const roleColors = {
  ADMIN: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  ANALYST: 'bg-accent/20 text-accent border-accent/30',
  VIEWER: 'bg-primary/20 text-primary border-primary/30',
};

export function DashboardHeader({ user, onLogout, onMenuToggle }: DashboardHeaderProps) {
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
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary/50"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex hover:bg-secondary/50"
          >
            <Settings className="h-5 w-5" />
          </Button>

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
              <DropdownMenuItem className="cursor-pointer hover:bg-secondary/50">
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
