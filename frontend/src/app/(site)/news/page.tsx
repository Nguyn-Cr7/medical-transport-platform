import React from "react";
import { NewsCard } from "@/components/NewsCard";
import { getPosts } from "@/lib/content";

export const metadata = {
  title: "Tin tức & Sự kiện",
  description: "Cập nhật thông tin y tế và các hoạt động của CAREVIA",
};

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Tin tức & Sự kiện</h1>
        <p className="text-slate-600">Cập nhật thông tin y tế và các hoạt động của CAREVIA</p>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl max-w-2xl mx-auto px-6">
            <p className="text-lg font-semibold text-slate-700 mb-2">
              Nội dung đang được cập nhật
            </p>
            <p className="text-sm text-slate-500">
              Hiện tại chưa có bài viết nào được xuất bản. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
