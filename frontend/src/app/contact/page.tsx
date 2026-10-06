import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata = { title: 'Liên hệ' };

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Liên hệ CAREVIA</h1>
        <p className="text-slate-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </section>
      
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Thông tin liên hệ</h2>
          <div className="space-y-6 text-slate-600">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-brand-primary mt-1" />
              <div>
                <h4 className="font-bold text-slate-900">Hotline</h4>
                <p>1900 xxxx (Hỗ trợ 24/7)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-brand-primary mt-1" />
              <div>
                <h4 className="font-bold text-slate-900">Email</h4>
                <p>contact@carevia.vn</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-brand-primary mt-1" />
              <div>
                <h4 className="font-bold text-slate-900">Trụ sở</h4>
                <p>Thành phố Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Nhập họ và tên..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input type="tel" className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Nhập số điện thoại..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
              <textarea rows={4} className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Nhập nội dung cần tư vấn..."></textarea>
            </div>
            <button type="button" className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors">
              GỬI THÔNG TIN
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
