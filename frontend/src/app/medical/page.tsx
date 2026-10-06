import React from 'react';
import { Metadata } from 'next';
import { SectionTitle } from '@/components/SectionTitle';
import { MedicalServiceCard } from '@/components/MedicalServiceCard';
import { CTASection } from '@/components/CTASection';
import { ZaloCTA } from '@/components/ZaloCTA';
import { MEDICAL_SERVICES, MEDICAL_PROCESS, MEDICAL_TEAM, MEDICAL_PARTNERS } from '@/data/medicalServices';

export const metadata: Metadata = {
  title: 'Dịch Vụ Y Tế Tại Nhà & Hỗ Trợ Tái Khám',
  description: 'Dịch vụ bác sĩ khám tại nhà, điều dưỡng chăm sóc, hỗ trợ tái khám bệnh viện và lấy mẫu xét nghiệm tận nơi.',
};

export default function MedicalPage() {
  return (
    <main className="pb-16">
      {/* Medical Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-950/40 via-slate-900/40 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            🏥 TRỤ CỘT Y TẾ CHUYÊN NGHIỆP
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Chăm Sóc Y Tế Chuyên Nghiệp <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Tận Nhà Với Sự Tận Tâm</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Đội ngũ bác sĩ, điều dưỡng giàu kinh nghiệm thăm khám, điều trị và hỗ trợ người bệnh tái khám tại các bệnh viện lớn với tiêu chuẩn y khoa nghiêm ngặt.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <ZaloCTA text="ĐĂNG KÝ KHÁM TẠI NHÀ" variant="secondary" size="lg" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="DỊCH VỤ DÀNH CHO BẠN"
          badgeColor="emerald"
          title="Danh Mục Dịch Vụ"
          highlightText="Y Tế Tận Nơi"
          subtitle="Chúng tôi cung cấp đa dạng các gói dịch vụ đáp ứng nhu cầu chăm sóc sức khỏe của từng thành viên trong gia đình."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MEDICAL_SERVICES.map((service) => (
            <MedicalServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/50 rounded-3xl border border-slate-800/80 my-12">
        <SectionTitle
          badge="QUY TRÌNH PHỤC VỤ"
          badgeColor="emerald"
          title="Quy Trình Sử Dụng Dịch Vụ"
          highlightText="4 Bước Đơn Giản"
          subtitle="Quy trình minh bạch, nhanh chóng giúp gia đình nhận hỗ trợ y tế kịp thời nhất."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEDICAL_PROCESS.map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-500/40 block mb-2">{item.step}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Medical Experts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          badge="ĐỘI NGŨ CHUYÊN MÔN"
          badgeColor="emerald"
          title="Đội Ngũ Y Bác Sĩ &"
          highlightText="Chuyên Gia"
          subtitle="Được đào tạo bài bản từ các trường Y Dược hàng đầu và có kinh nghiệm công tác tại các bệnh viện uy tín."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEDICAL_TEAM.map((doc, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl mb-4 border border-emerald-500/30">
                👨‍⚕️
              </div>
              <h3 className="text-xl font-bold text-white">{doc.name}</h3>
              <span className="text-xs font-semibold text-emerald-400 block mt-1">{doc.role}</span>
              <p className="text-xs text-slate-400 mt-2">{doc.exp}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 font-medium">
                Chuyên môn: {doc.specialty}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          ĐỐI TÁC Y TẾ & BỆNH VIỆN LIÊN KẾT
        </h4>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
          {MEDICAL_PARTNERS.map((partner, idx) => (
            <div key={idx} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
              🏥 {partner}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection title="Cần Bác Sĩ Hoặc Điều Dưỡng Thăm Khám Tận Nhà?" />
      </div>
    </main>
  );
}
