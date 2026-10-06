import React from 'react';
import { Ambulance } from 'lucide-react';
import { TransportServiceItem } from '@/data/transportServices';

export function TransportServiceCard({ service }: { service: TransportServiceItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6">
      <div className="w-14 h-14 bg-brand-light shrink-0 rounded-xl flex items-center justify-center text-brand-primary">
        <Ambulance size={28} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.shortDesc}</p>
        <ul className="text-sm text-slate-700 space-y-1">
          {service.features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-brand-secondary">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
