import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSettings, getServices } from "@/lib/content";

export async function Footer() {
  const [settings, medicalServices, transportServices] = await Promise.all([
    getSettings(),
    getServices("medical"),
    getServices("transport"),
  ]);

  const cleanHotline = settings.hotline.replace(/\s+/g, "");

  return (
    <footer className="bg-brand-primary-dark text-white pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Image
            src={settings.logoUrl || "/branding/logo-carevia.png"}
            alt={`${settings.companyName} Logo`}
            width={180}
            height={45}
            className="h-10 w-auto object-contain mb-4 brightness-0 invert"
          />
          <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
            {settings.footerText ||
              "Giải pháp toàn diện về chăm sóc y tế tại nhà và vận chuyển bệnh nhân an toàn, nhanh chóng, chuyên nghiệp."}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Dịch vụ Y tế</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            {medicalServices.slice(0, 4).map((s) => (
              <li key={s.id}>
                {s.actionType === "detail_page" ? (
                  <Link href={`/medical/${s.slug}`} className="hover:text-white transition-colors">
                    {s.title}
                  </Link>
                ) : (
                  <Link href="/medical" className="hover:text-white transition-colors">
                    {s.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Vận chuyển</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            {transportServices.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link href="/transport" className="hover:text-white transition-colors">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>
              Hotline:{" "}
              <a href={`tel:${cleanHotline}`} className="hover:text-white underline">
                {settings.hotline}
              </a>
            </li>
            {settings.phone && (
              <li>
                Điện thoại:{" "}
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            <li>
              Email:{" "}
              <a href={`mailto:${settings.email}`} className="hover:text-white underline">
                {settings.email}
              </a>
            </li>
            <li>
              Zalo:{" "}
              <a
                href={settings.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline"
              >
                Tư vấn qua Zalo
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white font-medium underline">
                Form liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-blue-800 text-center text-xs text-blue-200">
        &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
