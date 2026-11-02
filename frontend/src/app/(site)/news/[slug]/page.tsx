import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getPost, getPosts } from "@/lib/content";
import { CTASection } from "@/components/CTASection";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamicParams = true;

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPost(slug);

  if (!article) {
    return { title: "Bài viết không tồn tại | CAREVIA" };
  }

  const title = `${article.title} | CAREVIA`;
  const description = article.excerpt || "Tin tức và kiến thức y tế, chăm sóc sức khỏe từ CAREVIA.";
  const images = article.coverImageUrl ? [{ url: article.coverImageUrl, alt: article.title }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author || "CAREVIA"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const [article, allPosts] = await Promise.all([
    getPost(slug),
    getPosts(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = allPosts.filter((a) => a.slug !== slug).slice(0, 2);
  const cleanContent = sanitizeHtml(article.content);

  return (
    <main className="bg-white pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Quay lại danh sách tin tức
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary border border-brand-primary/20">
              {article.categoryLabel}
            </span>
            <span className="text-xs text-slate-500">
              {article.publishedAt} {article.readTime ? `• ${article.readTime}` : ""}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
            Tác giả: <strong className="text-slate-800">{article.author}</strong>
          </div>
        </header>

        {/* Content (Sanitized HTML) */}
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg border-b border-slate-200 pb-12"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Bài Viết Khác</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <div key={rel.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-brand-primary font-semibold">{rel.categoryLabel}</span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    <Link href={`/news/${rel.slug}`} className="hover:text-brand-primary transition-colors">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{rel.excerpt}</p>
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
