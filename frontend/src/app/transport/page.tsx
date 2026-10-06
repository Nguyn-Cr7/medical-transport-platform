import React from 'react';
import { CTASection } from '@/components/CTASection';
import { TransportServiceCard } from '@/components/TransportServiceCard';
import { TRANSPORT_SERVICES } from '@/data/transportServices';
import { Ambulance, MapPin, Clock, Route } from 'lucide-react';

export const metadata = { title: 'Dịch vụ Vận tải' };

export default function TransportPage() {
  return (
    <main>
      <section className="bg-brand-light py-20 lg:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Dịch vụ Vận tải Y tế</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
          Đội xe cứu thương hiện đại, phản ứng nhanh, an toàn trên từng cây số.
        </p>
      </section>
      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TRANSPORT_SERVICES.map(service => (
              <TransportServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </main>
  );
}
