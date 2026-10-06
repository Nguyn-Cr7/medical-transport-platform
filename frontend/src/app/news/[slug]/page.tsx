import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NEWS_ARTICLES } from '@/data/news';
import { CTASection } from '@/components/CTASection';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return { title: 'Bài viết không tồn tại' };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = NEWS_ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <main className="pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
        >
          ← Quay lại danh sách tin tức
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {article.categoryLabel}
            </span>
            <span className="text-xs text-slate-400">
              {article.publishedAt} • {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Tác giả: <strong className="text-slate-200">{article.author}</strong>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed space-y-6 text-base sm:text-lg border-b border-slate-800 pb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6">Bài Viết Khác</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <div key={rel.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-emerald-400 font-semibold">{rel.categoryLabel}</span>
                  <h4 className="text-base font-bold text-white mt-1">
                    <Link href={`/news/${rel.slug}`} className="hover:text-emerald-400 transition-colors">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{rel.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <CTASection />
      </div>
    </main>
  );
}
