'use client';

import { useHealthCheck } from '@/hooks/useHealthCheck';
import { API_BASE_URL } from '@/config/api';

export function HealthStatusBadge() {
  const { status, loading, error, refetch } = useHealthCheck();

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur shadow-lg max-w-md w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                loading
                  ? 'bg-amber-400'
                  : status?.status === 'UP'
                  ? 'bg-emerald-400'
                  : 'bg-rose-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                loading
                  ? 'bg-amber-500'
                  : status?.status === 'UP'
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <h3 className="text-sm font-semibold text-slate-200">
            Backend API Connection
          </h3>
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Kiểm tra...' : 'Thử lại'}
        </button>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Endpoint Target:</span>
          <code className="text-emerald-400 font-mono">{API_BASE_URL}/api/health</code>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Trạng thái kết nối:</span>
          <span
            className={`font-semibold ${
              loading
                ? 'text-amber-400'
                : status?.status === 'UP'
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {loading
              ? 'Đang kết nối...'
              : status?.status === 'UP'
              ? 'Hoạt động (HTTP 200 OK)'
              : 'Mất kết nối'}
          </span>
        </div>
        {status?.service && (
          <div className="flex justify-between text-slate-400">
            <span>Dịch vụ Backend:</span>
            <span className="text-slate-200 font-mono">{status.service}</span>
          </div>
        )}
        {error && (
          <div className="mt-2 p-2 rounded bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
