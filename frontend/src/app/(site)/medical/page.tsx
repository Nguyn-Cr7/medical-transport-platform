import React from "react";
import { MedicalServiceCard } from "@/components/MedicalServiceCard";
import { getServices, getSettings } from "@/lib/content";

export const metadata = {
  title: "Dịch vụ Y tế",
  description: "Chăm sóc y tế tại nhà chuyên nghiệp, tận tình bởi đội ngũ điều dưỡng, bác sĩ có trình độ chuyên môn cao.",
};

export default async function MedicalPage() {
  const [services, settings] = await Promise.all([
    getServices("medical"),
    getSettings(),
  ]);

  return (
    <main>
      <section className="bg-brand-light py-20 lg:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Dịch vụ Y tế</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
          Chăm sóc y tế tại nhà chuyên nghiệp, tận tình bởi đội ngũ điều dưỡng, bác sĩ có trình độ chuyên môn cao.
        </p>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl max-w-2xl mx-auto px-6">
              <p className="text-lg font-semibold text-slate-700 mb-2">
                Nội dung đang được cập nhật
              </p>
              <p className="text-sm text-slate-500">
                Hiện tại chưa có gói dịch vụ y tế nào được xuất bản. Vui lòng liên hệ hotline hoặc quay lại sau.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <MedicalServiceCard
                  key={service.id}
                  service={service}
                  defaultZaloUrl={settings.zaloUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
