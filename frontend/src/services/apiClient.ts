import { API_BASE_URL } from '@/config/api';
import { ApiResponse } from '@/types/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        return errorJson;
      } catch {
        return {
          success: false,
          message: `HTTP Error ${response.status}: ${response.statusText}`,
          data: null as unknown as T,
        };
      }
    }

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Không thể kết nối tới máy chủ backend API',
      data: null as unknown as T,
      errors: error,
    };
  }
}
