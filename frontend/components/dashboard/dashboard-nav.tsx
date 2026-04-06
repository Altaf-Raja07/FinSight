'use client';

import { LayoutDashboard, Receipt, Users, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'transactions' | 'users';

interface DashboardNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  userRole: UserRole;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'ANALYST', 'VIEWER'],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: Receipt,
    roles: ['ADMIN', 'ANALYST'],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    roles: ['ADMIN'],
  },
];

export function DashboardNav({
  currentView,
  onViewChange,
  userRole,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}: DashboardNavProps) {
  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <nav
      className={cn(
        'flex flex-col h-full',
        isMobile ? 'p-4' : 'p-4'
      )}
    >
      {/* Navigation Items */}
      <div className="space-y-1 flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 h-11 px-3 transition-all duration-200',
                isActive
                  ? 'bg-primary/20 text-primary hover:bg-primary/30 glow-border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                isCollapsed && !isMobile && 'justify-center px-0'
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && onToggleCollapse && (
        <div className="pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
          >
            <ChevronLeft
              className={cn(
                'w-4 h-4 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
            {!isCollapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      )}
    </nav>
  );
}
