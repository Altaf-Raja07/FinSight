import { apiClient } from './client';
import type { ApiResponse } from '../types';

export const getSummaryApi = async (): Promise<ApiResponse<any>> => {
  return apiClient.get('/dashboard/summary');
};

export const getCategoryBreakdownApi = async (type: string = 'EXPENSE'): Promise<ApiResponse<any[]>> => {
  return apiClient.get(`/dashboard/category-breakdown?type=${type}`);
};

export const getMonthlyTrendsApi = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get('/dashboard/monthly-trends');
};

export const getSpendingInsightsApi = async (): Promise<ApiResponse<any>> => {
  return apiClient.get('/dashboard/spending-insights');
};

export const getSmartInsightsApi = async (): Promise<ApiResponse<{ insights: string[] }>> => {
  return apiClient.get('/dashboard/smart-insights');
};

export const getActivityFeedApi = async (limit: number = 20): Promise<ApiResponse<any[]>> => {
  return apiClient.get(`/dashboard/activity-feed?limit=${limit}`);
};
