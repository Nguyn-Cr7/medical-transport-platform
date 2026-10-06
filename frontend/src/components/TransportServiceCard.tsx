'use client';

import React from 'react';
import Link from 'next/link';
import { TransportServiceItem } from '@/data/transportServices';
import { ZaloCTA } from './ZaloCTA';

interface TransportServiceCardProps {
  service: TransportServiceItem;
}

export function TransportServiceCard({ service }: TransportServiceCardProps) {
  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between">
      {service.popular && (
        <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950 shadow-md">
          Chuyến Phổ Biến
        </span>
      )}

      <div>
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
          🚑
        </div>

        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Vận Tải Y Tế
        </span>
        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors">
          {service.title}
        </h3>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          {service.shortDesc}
        </p>

        {/* Feature List */}
        <ul className="mt-5 space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Vehicle Badge */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase">Loại xe phục vụ:</span>
          <span className="text-xs text-slate-300 font-medium">{service.vehicleType}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <Link
          href="/transport"
          className="text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors"
        >
          Xem chi tiết ➔
        </Link>
        <ZaloCTA text="Đặt xe Zalo" size="sm" variant="primary" />
      </div>
    </div>
  );
}
