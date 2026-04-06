import { apiClient } from './client';
import type { ApiResponse, TransactionFilters } from '../types';

export const getTransactionsApi = async (filters: Partial<TransactionFilters> & { page?: number, limit?: number }): Promise<ApiResponse<any[]>> => {
  // Map frontend filter shape to backend query params
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
  if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.dateFrom) params.append('startDate', filters.dateFrom);
  if (filters.dateTo) params.append('endDate', filters.dateTo);

  return apiClient.get(`/transactions?${params.toString()}`);
};

export const createTransactionApi = async (data: any): Promise<ApiResponse<any>> => {
  return apiClient.post('/transactions', data);
};

export const updateTransactionApi = async (id: string, data: any): Promise<ApiResponse<any>> => {
  return apiClient.patch(`/transactions/${id}`, data);
};

export const deleteTransactionApi = async (id: string): Promise<ApiResponse<any>> => {
  return apiClient.delete(`/transactions/${id}`);
};

export const exportTransactionsApi = async (filters: Partial<TransactionFilters>) => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
  if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters.dateFrom) params.append('startDate', filters.dateFrom);
  if (filters.dateTo) params.append('endDate', filters.dateTo);

  // Using axios directly or a specific config to handle blob response
  const response = await apiClient.get(`/export/transactions?${params.toString()}`, {
    responseType: 'blob',
    // interceptors usually return response.data but for blob we might need to handle differently.
    // Assuming interceptor passes it through, the blob will be in the result.
  });
  return response;
};
