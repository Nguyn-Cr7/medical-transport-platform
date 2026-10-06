import React from 'react';
import { Metadata } from 'next';
import { SectionTitle } from '@/components/SectionTitle';
import { NewsCard } from '@/components/NewsCard';
import { NEWS_ARTICLES } from '@/data/news';

export const metadata: Metadata = {
  title: 'Tin Tức Y Tế & Vận Chuyển',
  description: 'Cập nhật tin tức y tế, hướng dẫn chăm sóc sức khỏe và thông tin hoạt động mới nhất.',
};

export default function NewsPage() {
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            📰 GÓC SỨC KHỎE & TIN TỨC
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Tin Tức & Kiến Thức <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Y Tế Vận Tải</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Tổng hợp tin tức chuyên ngành, kiến thức chăm sóc bệnh nhân tại nhà và hướng dẫn an toàn vận chuyển y tế.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="BÀI VIẾT MỚI NHẤT"
          title="Tin Tức &"
          highlightText="Bài Viết Hữu Ích"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ARTICLES.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
