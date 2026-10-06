'use client';

import React from 'react';
import Link from 'next/link';
import { COMPANY_INFO } from '@/data/companyInfo';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-md">
                MT
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MEDICAL & TRANSPORT
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Hệ sinh thái kết nối dịch vụ Y tế tại nhà và Vận chuyển bệnh nhân chuyên dụng hàng đầu. Cam kết an toàn, tận tâm và chuyên nghiệp 24/7.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={COMPANY_INFO.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
              >
                Zalo Official
              </a>
              <a
                href={COMPANY_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Facebook Page
              </a>
            </div>
          </div>

          {/* Col 2: Mảng Y Tế */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-emerald-500 pl-2">
              Dịch Vụ Y Tế
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/medical" className="hover:text-emerald-400 transition-colors">
                  Chăm sóc tại nhà
                </Link>
              </li>
              <li>
                <Link href="/medical" className="hover:text-emerald-400 transition-colors">
                  Hỗ trợ tái khám
                </Link>
              </li>
              <li>
                <Link href="/medical" className="hover:text-emerald-400 transition-colors">
                  Hỗ trợ người bệnh
                </Link>
              </li>
              <li>
                <Link href="/medical" className="hover:text-emerald-400 transition-colors">
                  Xét nghiệm tận nơi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Mảng Vận Tải */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-cyan-500 pl-2">
              Dịch Vụ Vận Tải
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/transport" className="hover:text-cyan-400 transition-colors">
                  Nhà ➔ Bệnh viện
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-cyan-400 transition-colors">
                  Bệnh viện ➔ Nhà
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-cyan-400 transition-colors">
                  Vận chuyển chuyển viện
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-cyan-400 transition-colors">
                  Đưa đón tái khám định kỳ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Thông Tin Liên Hệ */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-teal-500 pl-2">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs text-slate-500 uppercase">Hotline 24/7</span>
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, '')}`}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  {COMPANY_INFO.hotlineDisplay}
                </a>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase">Email</span>
                <span className="text-slate-300">{COMPANY_INFO.email}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase">Địa chỉ</span>
                <span className="text-slate-300 text-xs leading-snug">
                  {COMPANY_INFO.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {COMPANY_INFO.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              Giới thiệu
            </Link>
            <span>•</span>
            <Link href="/careers" className="hover:text-emerald-400 transition-colors">
              Tuyển dụng CTV
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
