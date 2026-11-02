import React from "react";
import {
  Ambulance,
  Home,
  ArrowRightLeft,
  CalendarCheck,
  Navigation,
  Car,
} from "lucide-react";
import type { ServiceItem } from "@/types/content";

function getTransportIcon(iconName: string) {
  switch (iconName) {
    case "Home":
      return <Home size={28} />;
    case "ArrowRightLeft":
      return <ArrowRightLeft size={28} />;
    case "CalendarCheck":
      return <CalendarCheck size={28} />;
    case "Navigation":
      return <Navigation size={28} />;
    case "Car":
      return <Car size={28} />;
    default:
      return <Ambulance size={28} />;
  }
}

interface TransportServiceCardProps {
  service: ServiceItem;
  defaultZaloUrl?: string;
}

export function TransportServiceCard({ service, defaultZaloUrl }: TransportServiceCardProps) {
  const cardBody = (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 h-full">
      <div className="w-14 h-14 bg-brand-light shrink-0 rounded-xl flex items-center justify-center text-brand-primary">
        {getTransportIcon(service.icon)}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.shortDesc}</p>
        <ul className="text-sm text-slate-700 space-y-1">
          {service.features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
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
        aria-label={`Liên hệ tư vấn dịch vụ ${service.title} qua Zalo`}
        className="block group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-2xl h-full"
      >
        {cardBody}
      </a>
    );
  }

  return (
    <div className="h-full" aria-label={service.title}>
      {cardBody}
    </div>
  );
}
