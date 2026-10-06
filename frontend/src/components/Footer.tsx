import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-brand-primary-dark text-white pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Image src="/branding/logo-carevia.png" alt="CAREVIA Logo" width={180} height={45} className="h-10 w-auto object-contain mb-4 brightness-0 invert" />
          <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
            Giải pháp toàn diện về chăm sóc y tế tại nhà và vận chuyển bệnh nhân an toàn, nhanh chóng, chuyên nghiệp.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Dịch vụ Y tế</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><Link href="/medical" className="hover:text-white">Chăm sóc tại nhà</Link></li>
            <li><Link href="/medical" className="hover:text-white">Hỗ trợ người bệnh</Link></li>
            <li><Link href="/medical" className="hover:text-white">Hỗ trợ tái khám</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Vận chuyển</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><Link href="/transport" className="hover:text-white">Nhà đến Bệnh viện</Link></li>
            <li><Link href="/transport" className="hover:text-white">Chuyển viện</Link></li>
            <li><Link href="/transport" className="hover:text-white">Đưa đón tái khám</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Hotline: 1900 xxxx</li>
            <li>Email: contact@carevia.vn</li>
            <li><Link href="/contact" className="hover:text-white">Form liên hệ</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-blue-800 text-center text-xs text-blue-200">
        &copy; {new Date().getFullYear()} CAREVIA. All rights reserved.
      </div>
    </footer>
  );
}
