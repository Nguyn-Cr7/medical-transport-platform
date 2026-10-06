import React from 'react';
import { Metadata } from 'next';
import { SectionTitle } from '@/components/SectionTitle';
import { CTASection } from '@/components/CTASection';
import { COMPANY_INFO } from '@/data/companyInfo';

export const metadata: Metadata = {
  title: 'Giới Thuyết Doanh Nghiệp',
  description: 'Giới thiệu tầm nhìn, sứ mệnh, giá trị cốt lõi và định hướng phát triển của Nền tảng Y tế & Vận tải.',
};

export default function AboutPage() {
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            🏢 TỔNG QUAN DOANH NGHIỆP
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Về Chúng Tôi - <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{COMPANY_INFO.name}</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {COMPANY_INFO.about.description}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-2xl mb-4">
              👁️
            </div>
            <h2 className="text-2xl font-bold text-white">Tầm Nhìn Chiến Lược</h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              {COMPANY_INFO.about.vision}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-2xl mb-4">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-white">Sứ Mệnh Phục Vụ</h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              {COMPANY_INFO.about.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="GIÁ TRỊ CỐT LÕI"
          title="Kim Chỉ Nam"
          highlightText="Hoạt Động"
          subtitle="Những giá trị định hình văn hóa và chất lượng dịch vụ của chúng tôi."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_INFO.about.values.map((val, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-emerald-400 font-bold text-lg block mb-2">0{idx + 1}</span>
              <h3 className="text-xl font-bold text-white">{val.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection />
      </div>
    </main>
  );
}
