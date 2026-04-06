'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, UserCheck, UserX, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUsersApi, updateUserStatusApi } from '@/lib/api/users.api';
import type { User, UserStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const roleStyles: Record<string, any> = {
  ADMIN: {
    bg: 'bg-chart-4/20',
    text: 'text-chart-4',
    border: 'border-chart-4/30',
  },
  ANALYST: {
    bg: 'bg-accent/20',
    text: 'text-accent',
    border: 'border-accent/30',
  },
  VIEWER: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/30',
  },
};

const statusStyles: Record<string, any> = {
  ACTIVE: {
    bg: 'bg-accent/20',
    text: 'text-accent',
    icon: UserCheck,
  },
  INACTIVE: {
    bg: 'bg-muted/20',
    text: 'text-muted-foreground',
    icon: UserX,
  },
};

export function UserManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUsersApi({ search: search || undefined });
      if (res.success) {
        // Map backend user shape to frontend shape
        const mappedUsers = res.data.map((u: any) => ({
           id: u._id,
           name: u.name,
           email: u.email,
           role: u.role,
           status: u.status,
           joinedAt: u.createdAt,
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name.replace(/\s/g, '')}`
        }));
        setUsers(mappedUsers);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);


  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await updateUserStatusApi(userId, newStatus);
      if (res.success) {
         toast.success('User status updated');
         setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as UserStatus } : u));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const inactiveCount = users.filter((u) => u.status === 'INACTIVE').length;

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 shimmer rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] shimmer rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
          gradient="from-primary/20 to-primary/5"
          iconBg="bg-primary/20"
          iconColor="text-primary"
        />
        <StatsCard
          title="Active Users"
          value={activeCount}
          icon={UserCheck}
          gradient="from-accent/20 to-accent/5"
          iconBg="bg-accent/20"
          iconColor="text-accent"
        />
        <StatsCard
          title="Inactive Users"
          value={inactiveCount}
          icon={UserX}
          gradient="from-muted/20 to-muted/5"
          iconBg="bg-muted/40"
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/30 border-border/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Joined</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="w-8 h-8" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleStyle = roleStyles[user.role] || roleStyles.VIEWER;
                const statusStyle = statusStyles[user.status] || statusStyles.INACTIVE;
                const StatusIcon = statusStyle.icon;
                const initials = user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2);

                return (
                  <TableRow 
                    key={user.id}
                    className="border-border/30 hover:bg-secondary/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/50">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/20 text-primary text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        roleStyle.bg,
                        roleStyle.text,
                        roleStyle.border
                      )}>
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                        statusStyle.bg,
                        statusStyle.text
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(user.joinedAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={user.status === 'ACTIVE'}
                          onCheckedChange={() => handleToggleStatus(user.id, user.status)}
                          className="data-[state=checked]:bg-accent"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Total {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

function StatsCard({ title, value, icon: Icon, gradient, iconBg, iconColor }: StatsCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
      'glass-card hover:scale-[1.02]'
    )}>
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradient)} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
