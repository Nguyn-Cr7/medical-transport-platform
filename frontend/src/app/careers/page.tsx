import React from 'react';
import { CareerCard } from '@/components/CareerCard';
import { CAREER_GROUPS } from '@/data/careers';

export const metadata = { title: 'Tuyển dụng' };

export default function CareersPage() {
  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Gia nhập CAREVIA</h1>
        <p className="text-slate-600">Cùng chúng tôi mang đến dịch vụ y tế tận tâm nhất</p>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_GROUPS.map(pos => <CareerCard key={pos.id} position={pos} />)}
        </div>
      </section>
    </main>
  );
}
