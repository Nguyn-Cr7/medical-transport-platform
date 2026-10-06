import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/branding/logo-carevia.png" alt="CAREVIA Logo" width={200} height={50} className="h-10 sm:h-12 w-auto object-contain" priority />
        </Link>
        <nav className="hidden md:flex gap-6 font-medium text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
          <Link href="/about" className="hover:text-brand-primary transition-colors">Giới thiệu</Link>
          <Link href="/medical" className="hover:text-brand-primary transition-colors">Y tế</Link>
          <Link href="/transport" className="hover:text-brand-primary transition-colors">Vận tải</Link>
          <Link href="/careers" className="hover:text-brand-primary transition-colors">Tuyển dụng</Link>
          <Link href="/news" className="hover:text-brand-primary transition-colors">Tin tức</Link>
          <Link href="/contact" className="hover:text-brand-primary transition-colors">Liên hệ</Link>
        </nav>
        <div className="flex items-center">
          <Link href="/contact" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm">
            ĐĂNG KÝ
          </Link>
        </div>
      </div>
    </header>
  );
}
