import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/content";

export async function FloatingContact() {
  const settings = await getSettings();
  const cleanHotline = settings.hotline.replace(/\s+/g, "");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={settings.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        aria-label="Liên hệ Zalo"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href={`tel:${cleanHotline}`}
        className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        aria-label={`Gọi Hotline ${settings.hotline}`}
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
