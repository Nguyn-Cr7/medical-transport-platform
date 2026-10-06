'use client';

import React from 'react';

interface SectionTitleProps {
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'indigo' | 'amber';
  title: string;
  highlightText?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({
  badge,
  badgeColor = 'emerald',
  title,
  highlightText,
  subtitle,
  align = 'center',
}: SectionTitleProps) {
  const badgeColorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const isCenter = align === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'}`}>
      {badge && (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${badgeColorMap[badgeColor]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
        {title}{' '}
        {highlightText && (
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            {highlightText}
          </span>
        )}
      </h2>
      {subtitle && <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
