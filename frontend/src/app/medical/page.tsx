import React from 'react';
import { CTASection } from '@/components/CTASection';
import { MedicalServiceCard } from '@/components/MedicalServiceCard';
import { MEDICAL_SERVICES } from '@/data/medicalServices';
import { HeartPulse, Stethoscope, UserRound, Home } from 'lucide-react';

export const metadata = { title: 'Dịch vụ Y tế' };

export default function MedicalPage() {
  return (
    <main>
      <section className="bg-brand-light py-20 lg:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Dịch vụ Y tế</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
          Chăm sóc y tế tại nhà chuyên nghiệp, tận tình bởi đội ngũ điều dưỡng, bác sĩ có trình độ chuyên môn cao.
        </p>
      </section>
      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MEDICAL_SERVICES.map(service => (
              <MedicalServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </main>
  );
}
