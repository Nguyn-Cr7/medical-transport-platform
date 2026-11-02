import React from "react";
import type { JobItem } from "@/types/content";

interface CareerCardProps {
  position: JobItem;
  zaloUrl?: string;
}

export function CareerCard({ position, zaloUrl = "https://zalo.me/0986767960" }: CareerCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-bold text-slate-900">{position.title}</h3>
          <span className="bg-brand-light text-brand-primary text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
            {position.badge}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-6 border-b border-slate-100 pb-4">
          <span className="flex items-center gap-1">📍 {position.location}</span>
          <span className="flex items-center gap-1">🕒 {position.workType}</span>
        </div>
        <p className="text-sm text-slate-600 mb-6 line-clamp-3">{position.description}</p>
      </div>

      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
      >
        ỨNG TUYỂN QUA ZALO
      </a>
    </div>
  );
}
