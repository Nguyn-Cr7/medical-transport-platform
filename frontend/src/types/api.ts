export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string> | any;
  timestamp?: string;
}

export interface HealthStatus {
  status: string;
  service: string;
}
