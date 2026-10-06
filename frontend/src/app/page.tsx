import React from 'react';
import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { MedicalServiceCard } from '@/components/MedicalServiceCard';
import { TransportServiceCard } from '@/components/TransportServiceCard';
import { NewsCard } from '@/components/NewsCard';
import { CTASection } from '@/components/CTASection';
import { ZaloCTA } from '@/components/ZaloCTA';
import { MEDICAL_SERVICES } from '@/data/medicalServices';
import { TRANSPORT_SERVICES } from '@/data/transportServices';
import { NEWS_ARTICLES } from '@/data/news';
import { CAREER_GROUPS } from '@/data/careers';
import { COMPANY_INFO } from '@/data/companyInfo';

export default function HomePage() {
  const featuredMedical = MEDICAL_SERVICES.slice(0, 3);
  const featuredTransport = TRANSPORT_SERVICES.slice(0, 3);
  const latestNews = NEWS_ARTICLES.slice(0, 3);

  return (
    <main className="pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Hệ Sinh Thái Y Tế & Vận Tải Chuyên Nghiệp Hàng Đầu
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-5xl mx-auto">
            Chăm Sóc Sức Khỏe <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Tận Nhà</span> &{' '}
            Vận Chuyển Y Tế <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">An Toàn</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Giải pháp tích hợp giúp gia đình bạn gánh bớt nỗi lo khám chữa bệnh. Đội ngũ y bác sĩ sẵn sàng phục vụ tại nhà kết hợp hệ thống xe đưa đón bệnh nhân chuyên dụng 24/7.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#ecosystem"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              TÌM HIỂU DỊCH VỤ ➔
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white transition-all hover:scale-105"
            >
              LIÊN HỆ TƯ VẤN
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CHIA 2 MẢNG RÕ RÀNG: Y TẾ VS VẬN TẢI (EQUAL BLOCKS) */}
      <section id="ecosystem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="HỆ SINH THÁI ĐỐI ỨNG"
          badgeColor="emerald"
          title="Hai Trụ Cột Dịch Vụ"
          highlightText="Song Hành"
          subtitle="Chúng tôi phát triển song song mảng Y tế tại nhà và Vận tải chuyên dụng với tầm quan trọng như nhau."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BLOCK 1: Y TẾ */}
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/30 p-8 sm:p-10 hover:border-emerald-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  TRỤ CỘT 01
                </span>
                <span className="text-4xl">🏥</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                MẢNG DỊCH VỤ Y TẾ
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Đưa dịch vụ y tế chuẩn bệnh viện đến tận không gian sống của bệnh nhân. Giảm bớt gánh nặng di chuyển cho người cao tuổi và người mắc bệnh mãn tính.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Chăm sóc y tế & Điều dưỡng tại nhà</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Hỗ trợ người bệnh & Người cao tuổi</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Nhân viên y tế hỗ trợ tái khám bệnh viện</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Lấy mẫu xét nghiệm chẩn đoán tận nơi</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="/medical"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                XEM CHI TIẾT DỊCH VỤ Y TẾ ➔
              </Link>
              <ZaloCTA text="Tư vấn Y tế" variant="secondary" size="sm" />
            </div>
          </div>

          {/* BLOCK 2: VẬN TẢI */}
          <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-2 border-cyan-500/30 p-8 sm:p-10 hover:border-cyan-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  TRỤ CỘT 02
                </span>
                <span className="text-4xl">🚑</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                MẢNG VẬN TẢI Y TẾ
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Phương tiện chuyên dụng đưa đón người bệnh an toàn, êm ái, đúng giờ. Phục vụ di chuyển giữa nhà riêng, bệnh viện và các tỉnh thành.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Đưa đón: Nhà ➔ Bệnh viện</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Đưa đón: Bệnh viện ➔ Nhà xuất viện</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Vận chuyển bệnh nhân chuyển viện liên tỉnh</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-lg">✓</span>
                  <span className="text-sm text-slate-200 font-medium">Trọn gói đưa đón tái khám định kỳ</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="/transport"
                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                XEM CHI TIẾT VẬN TẢI ➔
              </Link>
              <ZaloCTA text="Đặt Xe Zalo" variant="primary" size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MEDICAL SERVICES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mảng 01</span>
            <h2 className="text-3xl font-extrabold text-white">Dịch Vụ Y Tế Nổi Bật</h2>
          </div>
          <Link href="/medical" className="text-sm font-bold text-emerald-400 hover:underline">
            Xem tất cả dịch vụ y tế ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMedical.map((service) => (
            <MedicalServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED TRANSPORT SERVICES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mảng 02</span>
            <h2 className="text-3xl font-extrabold text-white">Dịch Vụ Vận Tải Nổi Bật</h2>
          </div>
          <Link href="/transport" className="text-sm font-bold text-cyan-400 hover:underline">
            Xem tất cả dịch vụ vận tải ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTransport.map((service) => (
            <TransportServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 5. RECRUITMENT TEASER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 md:p-12">
          <SectionTitle
            badge="GIA NHẬP ĐỘI NGŨ"
            badgeColor="indigo"
            title="Tuyển Dụng & Gia Nhập Đội Ngũ"
            highlightText="Cộng Tác Viên"
            subtitle="Chúng tôi liên tục tìm kiếm và hợp tác với các đối tác, cộng tác viên chuyên môn trong mảng Y Tế, Vận Tải, Truyền Thông và Kinh Doanh."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAREER_GROUPS.map((group) => (
              <div key={group.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase">{group.badge}</span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">{group.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">{group.shortDesc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <ZaloCTA text="Ứng Tuyển Zalo" size="sm" variant="gradient" className="w-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/careers" className="inline-block text-sm font-bold text-indigo-400 hover:underline">
              Xem chi tiết yêu cầu & quyền lợi tuyển dụng ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS TEASER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="TIN TỨC & GÓC SỨC KHỎE"
          title="Thông Tin Y Tế &"
          highlightText="Vận Chuyển"
          subtitle="Cập nhật tin tức mới nhất, lời khuyên y tế hữu ích và hoạt động mới nhất của doanh nghiệp."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 7. REUSABLE CTA SECTION */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection />
      </div>
    </main>
  );
}
