'use client';

import React from 'react';
import { ZaloCTA } from './ZaloCTA';
import { COMPANY_INFO } from '@/data/companyInfo';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

export function CTASection({
  title = "Bạn Cần Tư Vấn Dịch Vụ Y Tế Hoặc Đặt Xe Vận Chuyển?",
  subtitle = "Đội ngũ chuyên viên y tế và tư vấn viên của chúng tôi túc trực 24/7 sẵn sàng hỗ trợ bạn tức thì.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-slate-800 p-8 sm:p-12 text-center my-16 shadow-2xl">
      <div className="relative z-10 max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
          TƯ VẤN & ĐẶT DỊCH VỤ 24/7
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-base text-slate-300 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-rose-600/25 hover:scale-105 transition-all text-sm"
          >
            GỌI HOTLINE: {COMPANY_INFO.hotlineDisplay}
          </a>
          <ZaloCTA text="CHAT TƯ VẤN QUA ZALO" variant="gradient" size="lg" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
