'use client';

import { useState, useEffect, useCallback } from 'react';
import { healthService } from '@/services/healthService';
import { HealthStatus } from '@/types/api';

export function useHealthCheck() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await healthService.checkHealth();
      if (res.success && res.data) {
        setStatus(res.data);
        setError(null);
      } else {
        setStatus(null);
        setError(res.message || 'Không thể kết nối đến backend API');
      }
    } catch (err: any) {
      setStatus(null);
      setError(err?.message || 'Lỗi mạng khi kết nối backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { status, loading, error, refetch: checkStatus };
}
