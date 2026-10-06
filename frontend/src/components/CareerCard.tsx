import React from 'react';
import { CareerGroup } from '@/data/careers';

export function CareerCard({ position }: { position: CareerGroup }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-900">{position.title}</h3>
        <span className="bg-brand-light text-brand-primary text-xs font-bold px-3 py-1 rounded-full">{position.badge}</span>
      </div>
      <div className="flex gap-4 text-xs font-medium text-slate-500 mb-6 border-b border-slate-100 pb-4">
        <span className="flex items-center gap-1">📍 {position.location}</span>
        <span className="flex items-center gap-1">🕒 {position.workType}</span>
      </div>
      <p className="text-sm text-slate-600 mb-6 line-clamp-3">{position.description}</p>
      <a href={process.env.NEXT_PUBLIC_ZALO_URL || '#'} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-2 rounded-lg transition-colors text-sm">
        ỨNG TUYỂN QUA ZALO
      </a>
    </div>
  );
}
