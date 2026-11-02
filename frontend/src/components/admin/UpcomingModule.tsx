import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

interface UpcomingModuleProps {
  title: string;
  phase: string;
  description: string;
}

export function UpcomingModule({ title, phase, description }: UpcomingModuleProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
        <Clock size={32} />
      </div>
      <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
        Kế hoạch triển khai: {phase}
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại Dashboard
      </Link>
    </div>
  );
}

