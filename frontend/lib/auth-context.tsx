'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { User, UserRole, AuthState } from './types';
import { loginApi, registerApi, getMeApi } from './api/auth.api';

const AUTH_STORAGE_KEY = 'financeflow_auth_user';
const TOKEN_STORAGE_KEY = 'financeflow_auth_token';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map backend user to frontend user
const mapUser = (backendUser: any): User => ({
  id: backendUser._id || backendUser.id,
  name: backendUser.name,
  email: backendUser.email,
  role: backendUser.role,
  status: backendUser.status,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.name.replace(/\s/g, '')}`,
  joinedAt: backendUser.createdAt || backendUser.joinedAt,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from server (via token) on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          const res = await getMeApi();
          if (res.success && res.data?.user) {
            setUser(mapUser(res.data.user));
          } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await loginApi(email, password);
      if (res.success && res.data) {
        const { user: backendUser, token } = res.data;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(mapUser(backendUser));
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Login failed:', error?.message || error);
    }
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await registerApi(name, email, password, role);
      if (res.success && res.data) {
        const { user: backendUser, token } = res.data;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(mapUser(backendUser));
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Register failed:', error?.message || error);
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const hasPermission = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
  }), [user, isLoading, login, register, logout, hasPermission]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
