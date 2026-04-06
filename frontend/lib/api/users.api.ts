import { apiClient } from './client';
import type { ApiResponse } from '../types';

export const getUsersApi = async (params: { page?: number, limit?: number, search?: string } = {}): Promise<ApiResponse<any[]>> => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search); // Not built-in backend, but good to have
  
  return apiClient.get(`/users?${query.toString()}`);
};

export const updateUserStatusApi = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<any>> => {
  return apiClient.patch(`/users/${id}/status`, { status });
};
