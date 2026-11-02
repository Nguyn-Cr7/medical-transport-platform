import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, HeartHandshake, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      <section className="bg-brand-light py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Chăm Sóc Sức Khỏe Tận Nhà & <span className="text-brand-primary">Vận Chuyển Y Tế An Toàn</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              CAREVIA cung cấp giải pháp y tế và vận chuyển chuyên nghiệp, tận tâm, giúp bạn và người thân luôn an tâm trên mọi hành trình sức khỏe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/medical" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-8 rounded-lg text-center transition-colors">
                TÌM HIỂU DỊCH VỤ
              </Link>
              <Link href="/contact" className="bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-light font-bold py-3 px-8 rounded-lg text-center transition-colors">
                LIÊN HỆ TƯ VẤN
              </Link>
            </div>
          </div>
          <div className="bg-slate-200 rounded-2xl aspect-[4/3] flex items-center justify-center border border-slate-300 shadow-sm overflow-hidden">
             <div className="text-slate-400 font-medium">Healthcare Image Placeholder</div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Dịch vụ của CAREVIA</h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <HeartHandshake className="w-12 h-12 text-brand-secondary mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Dịch vụ Y Tế</h3>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex items-center gap-2">✓ Chăm sóc tại nhà</li>
              <li className="flex items-center gap-2">✓ Hỗ trợ người bệnh</li>
              <li className="flex items-center gap-2">✓ Hỗ trợ tái khám</li>
              <li className="flex items-center gap-2">✓ Dịch vụ chuyên môn khác</li>
            </ul>
            <Link href="/medical" className="inline-block font-semibold text-brand-primary hover:text-brand-primary-dark">
              XEM DỊCH VỤ Y TẾ →
            </Link>
          </div>

          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <MapPin className="w-12 h-12 text-brand-primary mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Dịch vụ Vận Tải</h3>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex items-center gap-2">✓ Nhà → Bệnh viện</li>
              <li className="flex items-center gap-2">✓ Bệnh viện → Nhà</li>
              <li className="flex items-center gap-2">✓ Chuyển viện</li>
              <li className="flex items-center gap-2">✓ Đưa đón tái khám</li>
            </ul>
            <Link href="/transport" className="inline-block font-semibold text-brand-primary hover:text-brand-primary-dark">
              XEM DỊCH VỤ VẬN TẢI →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-green-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tại sao chọn CAREVIA?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <HeartHandshake className="w-10 h-10 text-brand-secondary mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Tận tâm</h4>
              <p className="text-slate-600 text-sm">Chăm sóc khách hàng như người thân trong gia đình.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <ShieldCheck className="w-10 h-10 text-brand-secondary mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">An toàn</h4>
              <p className="text-slate-600 text-sm">Trang thiết bị hiện đại, quy trình chuẩn y tế.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Clock className="w-10 h-10 text-brand-secondary mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Nhanh chóng</h4>
              <p className="text-slate-600 text-sm">Hỗ trợ kịp thời, đúng giờ trong mọi tình huống.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <HeartHandshake className="w-10 h-10 text-brand-secondary mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Chuyên nghiệp</h4>
              <p className="text-slate-600 text-sm">Đội ngũ được đào tạo bài bản, chuyên môn cao.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
