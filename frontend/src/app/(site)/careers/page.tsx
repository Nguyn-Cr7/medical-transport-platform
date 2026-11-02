import React from "react";
import { CareerCard } from "@/components/CareerCard";
import { getJobs, getSettings } from "@/lib/content";

export const metadata = {
  title: "Tuyển dụng",
  description: "Gia nhập đội ngũ CAREVIA - Cùng chúng tôi mang đến dịch vụ y tế tận tâm nhất.",
};

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([
    getJobs(),
    getSettings(),
  ]);

  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Gia nhập CAREVIA</h1>
        <p className="text-slate-600">Cùng chúng tôi mang đến dịch vụ y tế tận tâm nhất</p>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl max-w-2xl mx-auto px-6">
            <p className="text-lg font-semibold text-slate-700 mb-2">
              Chưa có vị trí tuyển dụng mới
            </p>
            <p className="text-sm text-slate-500">
              Hiện tại chúng tôi chưa có vị trí mở tuyển. Bạn có thể gửi thông tin liên hệ để được ưu tiên khi có đợt tuyển dụng tiếp theo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((pos) => (
              <CareerCard
                key={pos.id}
                position={pos}
                zaloUrl={settings.zaloUrl}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
