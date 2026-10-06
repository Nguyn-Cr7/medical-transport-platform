'use client';

import React from 'react';
import { CareerGroup } from '@/data/careers';
import { ZaloCTA } from './ZaloCTA';

interface CareerCardProps {
  career: CareerGroup;
}

export function CareerCard({ career }: CareerCardProps) {
  const badgeColors: Record<string, string> = {
    'y-te': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'tai-xe': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'truyen-thong': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'kinh-doanh': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              badgeColors[career.categoryKey] || 'bg-slate-800 text-slate-300'
            }`}
          >
            CTV {career.badge}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            📍 {career.location}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
          {career.title}
        </h3>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {career.description}
        </p>

        {/* Education / Specific Requirement Highlight if present */}
        {career.educationRequirement && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-400 block mb-1">🎓 Yêu cầu bằng cấp / Chuyên môn:</span>
            <span className="text-emerald-200">{career.educationRequirement}</span>
          </div>
        )}

        {/* Requirements */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Yêu cầu ứng tuyển:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {career.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quyền lợi cộng tác viên:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {career.benefits.map((ben, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{ben}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subdivisions if present */}
        {career.subDivisions && (
          <div className="mt-4 flex flex-wrap gap-2">
            {career.subDivisions.map((sub, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA Action */}
      <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-400">Hình thức: <strong className="text-slate-200">{career.workType}</strong></span>
        <ZaloCTA text="ỨNG TUYỂN QUA ZALO" variant="gradient" size="md" className="w-full sm:w-auto" />
      </div>
    </div>
  );
}
