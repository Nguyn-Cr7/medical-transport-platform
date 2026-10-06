'use client';

import React from 'react';
import Link from 'next/link';
import { MedicalServiceItem } from '@/data/medicalServices';
import { ZaloCTA } from './ZaloCTA';

interface MedicalServiceCardProps {
  service: MedicalServiceItem;
}

export function MedicalServiceCard({ service }: MedicalServiceCardProps) {
  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {service.popular && (
        <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-md">
          Phổ Biến
        </span>
      )}

      <div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
          🏥
        </div>

        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          {service.category}
        </span>
        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
          {service.title}
        </h3>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          {service.shortDesc}
        </p>

        {/* Feature List */}
        <ul className="mt-5 space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Target Patient Badge */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase">Đối tượng phục vụ:</span>
          <span className="text-xs text-slate-300 leading-snug">{service.targetPatients}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <Link
          href="/medical"
          className="text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors"
        >
          Xem chi tiết ➔
        </Link>
        <ZaloCTA text="Đăng ký Zalo" size="sm" variant="secondary" />
      </div>
    </div>
  );
}
