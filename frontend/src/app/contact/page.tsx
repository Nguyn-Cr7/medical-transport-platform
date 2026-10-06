'use client';

import React, { useState } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { ZaloCTA } from '@/components/ZaloCTA';
import { COMPANY_INFO } from '@/data/companyInfo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    serviceType: 'medical',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            📞 TRUNG TÂM HỖ TRỢ 24/7
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Liên Hệ Với Chúng Tôi <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Bất Kỳ Lúc Nào</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Đội ngũ tư vấn viên luôn túc trực để tiếp nhận nhu cầu đặt dịch vụ Y tế tại nhà hoặc Vận chuyển bệnh nhân cấp tốc.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details Card */}
          <div className="space-y-8">
            <SectionTitle
              align="left"
              badge="THÔNG TIN LIÊN HỆ"
              title="Kênh Kết Nối"
              highlightText="Trực Tiếp"
              subtitle="Liên hệ ngay để nhận báo giá và tư vấn miễn phí."
            />

            <div className="space-y-6">
              {/* Hotline */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xl shrink-0 border border-rose-500/20">
                  ☎️
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Hotline Tư Vấn 24/7</span>
                  <a
                    href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, '')}`}
                    className="text-2xl font-black text-rose-400 block hover:underline"
                  >
                    {COMPANY_INFO.hotlineDisplay}
                  </a>
                  <span className="text-xs text-slate-400">Phục vụ liên tục kể cả ngày Lễ/Tết</span>
                </div>
              </div>

              {/* Zalo Official */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 border border-blue-500/20">
                  💬
                </div>
                <div className="flex-grow">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Kênh Zalo Trực Tuyến</span>
                  <h3 className="text-lg font-bold text-white mb-2">Zalo Chat & Báo Giá Nhanh</h3>
                  <ZaloCTA text="MỞ ZALO CHAT NAY" variant="primary" size="sm" />
                </div>
              </div>

              {/* Email & Address */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Email Hỗ Trợ</span>
                  <span className="text-sm text-slate-200 font-medium">{COMPANY_INFO.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Địa Chỉ Trụ Sở</span>
                  <span className="text-sm text-slate-300 leading-snug">{COMPANY_INFO.address}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Thời Gian Làm Việc</span>
                  <span className="text-sm text-slate-300 font-medium">{COMPANY_INFO.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form UI */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Gửi Yêu Cầu Tư Vấn</h3>
              <p className="text-xs text-slate-400 mb-6">
                Điền thông tin của bạn vào mẫu bên dưới, chuyên viên của chúng tôi sẽ gọi lại ngay lập tức.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 my-8 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl mx-auto">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white">Gửi Yêu Cầu Thành Công!</h4>
                  <p className="text-xs text-emerald-200">
                    Cảm ơn bạn đã liên hệ. Bộ phận chăm sóc khách hàng sẽ gọi lại cho bạn qua số {formData.phone} trong ít phút.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-400 underline font-semibold pt-2"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Họ và tên <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Số điện thoại liên hệ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0988 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lĩnh vực quan tâm
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="medical">Dịch vụ Y Tế Tại Nhà / Hỗ trợ tái khám</option>
                      <option value="transport">Dịch vụ Vận Chuyển Y Tế / Đưa đón bệnh nhân</option>
                      <option value="career">Đăng ký Cộng tác viên (Y tế/Tài xế/Kinh doanh)</option>
                      <option value="other">Tư vấn khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ghi chú thêm (Tình trạng bệnh nhân / Địa chỉ đón)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập chi tiết nhu cầu..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    GỬI YÊU CẦU TƯ VẤN NGAY
                  </button>
                </form>
              )}
            </div>

            {/* Map Placeholder Card */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">🗺️ Bản đồ vị trí trụ sở</span>
                <span className="text-xs font-medium text-slate-300">{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
