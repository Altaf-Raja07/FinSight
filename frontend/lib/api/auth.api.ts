import { apiClient } from './client';
import type { ApiResponse, UserRole } from '../types';

interface AuthResponse {
  user: any; // backend user model
  token: string;
}

export const loginApi = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  return apiClient.post('/auth/login', { email, password });
};

export const registerApi = async (name: string, email: string, password: string, role: UserRole): Promise<ApiResponse<AuthResponse>> => {
  return apiClient.post('/auth/register', { name, email, password, role });
};

export const getMeApi = async (): Promise<ApiResponse<{ user: any }>> => {
  return apiClient.get('/auth/me');
};
