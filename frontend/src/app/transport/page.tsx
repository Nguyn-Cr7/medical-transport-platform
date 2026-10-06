import React from 'react';
import { Metadata } from 'next';
import { SectionTitle } from '@/components/SectionTitle';
import { TransportServiceCard } from '@/components/TransportServiceCard';
import { CTASection } from '@/components/CTASection';
import { ZaloCTA } from '@/components/ZaloCTA';
import { TRANSPORT_SERVICES, TRANSPORT_PROCESS, COVERAGE_AREAS } from '@/data/transportServices';

export const metadata: Metadata = {
  title: 'Vận Chuyển Y Tế & Đưa Đón Bệnh Nhân',
  description: 'Dịch vụ đưa đón bệnh nhân Nhà đến Bệnh viện, Bệnh viện về Nhà, chuyển viện liên tỉnh an toàn, chuyên nghiệp.',
};

export default function TransportPage() {
  return (
    <main className="pb-16">
      {/* Transport Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cyan-950/40 via-slate-900/40 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            🚑 TRỤ CỘT VẬN TẢI Y TẾ
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Vận Chuyển Y Tế Chuyên Dụng <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Êm Ái & Đúng Giờ</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Hệ thống xe đưa đón bệnh nhân trang bị xe đẩy, băng ca di chuyển nhẹ nhàng, phục vụ tận tâm các tuyến Nhà ↔ Bệnh viện và chuyển viện liên tỉnh 24/7.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <ZaloCTA text="ĐẶT XE VẬN CHUYỂN ZALO" variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="CÁC TUYẾN PHỤC VỤ"
          badgeColor="cyan"
          title="Dịch Vụ Vận Chuyển"
          highlightText="Y Tế"
          subtitle="Đa dạng hình thức xe phục vụ đáp ứng chính xác nhu cầu di chuyển của bệnh nhân."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRANSPORT_SERVICES.map((service) => (
            <TransportServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/50 rounded-3xl border border-slate-800/80 my-12">
        <SectionTitle
          badge="QUY TRÌNH ĐẶT XE"
          badgeColor="cyan"
          title="Quy Trình Vận Chuyển Bệnh Nhân"
          highlightText="4 Bước"
          subtitle="Chỉ cần liên hệ trước, tài xế và phương tiện sẽ có mặt đúng giờ hẹn."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRANSPORT_PROCESS.map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-cyan-500/40 block mb-2">{item.step}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="MẠNG LƯỚI PHỤC VỤ"
          badgeColor="cyan"
          title="Khu Vực Phục Vụ"
          highlightText="Mạng Lưới Vận Chuyển"
          subtitle="Sẵn sàng điều xe nhanh chóng tại TP.HCM và các tỉnh lân cận khu vực phía Nam."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COVERAGE_AREAS.map((area, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-3">
                📍
              </div>
              <h3 className="text-lg font-bold text-white">{area.name}</h3>
              <p className="text-xs text-slate-400 mt-2">{area.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection title="Cần Đặt Xe Đưa Đón Bệnh Nhân Tận Nhà Ngay Hôn Nay?" />
      </div>
    </main>
  );
}
