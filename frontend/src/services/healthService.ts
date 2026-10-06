import { fetchApi } from './apiClient';
import { ApiResponse, HealthStatus } from '@/types/api';

export const healthService = {
  checkHealth: async (): Promise<ApiResponse<HealthStatus>> => {
    return fetchApi<HealthStatus>('/api/health');
  },
};
