import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/content";

export async function FloatingContact() {
  const settings = await getSettings();
  const cleanHotline = settings.hotline.replace(/\s+/g, "");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {settings.facebookUrl && (
        <a
          href={settings.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
          aria-label="Fanpage Facebook"
          title="Fanpage Facebook"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      )}
      <a
        href={settings.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
        aria-label="Liên hệ Zalo"
        title="Chat Zalo"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href={`tel:${cleanHotline}`}
        className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
        aria-label={`Gọi Hotline ${settings.hotline}`}
        title={`Gọi Hotline ${settings.hotline}`}
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
