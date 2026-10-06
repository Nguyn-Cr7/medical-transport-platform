import React from 'react';
import { NewsCard } from '@/components/NewsCard';
import { NEWS_ARTICLES } from '@/data/news';

export const metadata = { title: 'Tin tức' };

export default function NewsPage() {
  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Tin tức & Sự kiện</h1>
        <p className="text-slate-600">Cập nhật thông tin y tế và các hoạt động của CAREVIA</p>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ARTICLES.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      </section>
    </main>
  );
}
