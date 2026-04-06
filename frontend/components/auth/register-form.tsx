'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('VIEWER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = await register(name, email, password, role);
    
    if (success) {
      onSuccess?.();
    } else {
      setError('Email already exists. Please try another.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-11 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">
            Account Role
          </Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={isLoading}>
              <SelectTrigger className="pl-11 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="ADMIN" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">Full access to all features</span>
                  </div>
                </SelectItem>
                <SelectItem value="ANALYST" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">Analyst</span>
                    <span className="text-xs text-muted-foreground">View analytics & transactions</span>
                  </div>
                </SelectItem>
                <SelectItem value="VIEWER" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">Viewer</span>
                    <span className="text-xs text-muted-foreground">Read-only dashboard access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:glow-primary group"
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner className="w-5 h-5" />
        ) : (
          <>
            Create Account
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{' '}
        <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
