import React from 'react';
import { Metadata } from 'next';
import { SectionTitle } from '@/components/SectionTitle';
import { CareerCard } from '@/components/CareerCard';
import { CTASection } from '@/components/CTASection';
import { CAREER_GROUPS } from '@/data/careers';

export const metadata: Metadata = {
  title: 'Tuyển Dụng & Cộng Tác Viên Y Tế - Vận Tải',
  description: 'Tuyển dụng Cộng tác viên Y tế, CTV Tài xế Part-time, CTV Truyền thông và CTV Kinh doanh mảng Y tế & Vận tải.',
};

export default function CareersPage() {
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-950/40 via-slate-900/40 to-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            🤝 ĐỒNG HÀNH CÙNG NỀN TẢNG
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Tuyển Dụng & Hợp Tác <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Cộng Tác Viên</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Gia nhập cộng đồng hợp tác linh hoạt cùng Nền tảng Y Tế & Vận Tải. Thu nhập hấp dẫn, thời gian tự do, môi trường văn minh và giàu tính nhân văn.
          </p>
        </div>
      </section>

      {/* Career List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="CÁC VỊ TRÍ TUYỂN DỤNG"
          badgeColor="indigo"
          title="4 Nhóm Vị Trí"
          highlightText="Đang Tuyển"
          subtitle="Ứng viên nộp hồ sơ trực tiếp nhanh chóng thông qua kênh Zalo chính thức."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CAREER_GROUPS.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection
          title="Bạn Đã Sẵn Sàng Gia Nhập Cùng Chúng Tôi?"
          subtitle="Hãy nhắn tin Zalo ngay cho bộ phận Tuyển dụng để được hỗ trợ giải đáp thắc mắc và nhận ca làm việc nhanh nhất."
        />
      </div>
    </main>
  );
}
