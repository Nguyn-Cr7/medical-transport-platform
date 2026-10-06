import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function FloatingContact() {
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/yourzalo';
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Link href={zaloUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform" aria-label="Zalo">
        <MessageCircle size={24} />
      </Link>
      <Link href="tel:1900xxxx" className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform" aria-label="Hotline">
        <Phone size={24} />
      </Link>
    </div>
  );
}
