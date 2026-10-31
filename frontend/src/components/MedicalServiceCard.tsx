import React from "react";
import Link from "next/link";
import { HeartPulse, UserCheck, HeartHandshake, TestTube } from "lucide-react";
import type { ServiceItem } from "@/types/content";

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case "UserCheck":
      return <UserCheck size={24} />;
    case "HeartHandshake":
      return <HeartHandshake size={24} />;
    case "TestTube":
      return <TestTube size={24} />;
    default:
      return <HeartPulse size={24} />;
  }
}

interface MedicalServiceCardProps {
  service: ServiceItem;
  defaultZaloUrl?: string;
}

export function MedicalServiceCard({ service, defaultZaloUrl }: MedicalServiceCardProps) {
  const cardBody = (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-primary mb-6">
          {getServiceIcon(service.icon)}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {service.shortDesc || service.fullDesc}
        </p>
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bao gồm:</span>
        <ul className="text-sm text-slate-700 space-y-1">
          {service.features.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand-secondary">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (service.actionType === "zalo") {
    const targetUrl = service.zaloUrl || defaultZaloUrl || "https://zalo.me/0986767960";
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Liên hệ tư vấn dịch vụ ${service.title} qua Zalo (mở tab mới)`}
        className="block group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-2xl h-full"
      >
        {cardBody}
      </a>
    );
  }

  if (service.actionType === "detail_page") {
    return (
      <Link
        href={`/medical/${service.slug}`}
        aria-label={`Xem chi tiết bảng giá dịch vụ ${service.title}`}
        className="block group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-2xl h-full"
      >
        {cardBody}
      </Link>
    );
  }

  return (
    <div className="h-full" aria-label={service.title}>
      {cardBody}
    </div>
  );
}
