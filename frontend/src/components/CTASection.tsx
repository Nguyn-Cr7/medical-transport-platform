import React from 'react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-brand-primary text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Sẵn sàng để CAREVIA chăm sóc bạn?</h2>
        <p className="text-blue-100 text-lg mb-8">Liên hệ ngay để nhận được tư vấn chi tiết về các dịch vụ y tế và vận chuyển tốt nhất.</p>
        <Link href="/contact" className="inline-block bg-white text-brand-primary hover:bg-slate-100 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg">
          LIÊN HỆ TƯ VẤN NGAY
        </Link>
      </div>
    </section>
  );
}
