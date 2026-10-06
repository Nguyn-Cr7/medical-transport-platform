'use client';

import React from 'react';
import { COMPANY_INFO } from '@/data/companyInfo';

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* Phone Hotline Button */}
      <a
        href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, '')}`}
        className="group flex items-center gap-3 bg-gradient-to-r from-rose-600 to-red-500 text-white p-3 md:px-4 md:py-3 rounded-full shadow-lg shadow-rose-600/30 hover:scale-105 transition-all duration-300"
        title="Gọi Hotline Tư Vấn 24/7"
      >
        <span className="hidden md:inline text-xs font-bold tracking-wide pl-1">
          HOTLINE: {COMPANY_INFO.hotlineDisplay}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </div>
      </a>

      {/* Zalo Button */}
      <a
        href={COMPANY_INFO.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 md:px-4 md:py-3 rounded-full shadow-lg shadow-blue-600/30 hover:scale-105 transition-all duration-300"
        title="Chat Qua Zalo"
      >
        <span className="hidden md:inline text-xs font-bold tracking-wide pl-1">
          CHAT ZALO NGAY
        </span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="font-bold text-xs">ZALO</span>
        </div>
      </a>
    </div>
  );
}
