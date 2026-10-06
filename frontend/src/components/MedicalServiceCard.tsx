import React from 'react';
import { HeartPulse } from 'lucide-react';
import { MedicalServiceItem } from '@/data/medicalServices';

export function MedicalServiceCard({ service }: { service: MedicalServiceItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-primary mb-6">
        <HeartPulse size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.shortDesc || service.fullDesc}</p>
      
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bao gồm:</span>
        <ul className="text-sm text-slate-700 space-y-1">
          {service.features.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand-secondary">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
