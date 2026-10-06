import React from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/data/news';

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="aspect-video bg-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="text-slate-400 font-medium">Image Placeholder</div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-brand-primary rounded-full shadow-sm">
          {article.categoryLabel}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="text-xs text-slate-500 mb-3">{article.publishedAt}</div>
        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
          {article.excerpt}
        </p>
        <div className="text-sm font-semibold text-brand-primary mt-auto">Xem chi tiết →</div>
      </div>
    </Link>
  );
}
