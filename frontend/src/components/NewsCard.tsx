'use client';

import React from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/data/news';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const categoryBadgeColors: Record<string, string> = {
    medical: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    transport: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    company: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <article className="group rounded-2xl bg-slate-900/80 border border-slate-800 p-6 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg">
      <div>
        {/* Top Badges & Date */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              categoryBadgeColors[article.category] || 'bg-slate-800 text-slate-300'
            }`}
          >
            {article.categoryLabel}
          </span>
          <span className="text-xs text-slate-500">
            {article.publishedAt} • {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
          <Link href={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500">Tác giả: <strong className="text-slate-300">{article.author}</strong></span>
        <Link
          href={`/news/${article.slug}`}
          className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          Đọc tiếp ➔
        </Link>
      </div>
    </article>
  );
}
