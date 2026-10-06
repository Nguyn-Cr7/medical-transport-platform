import React from 'react';
import { CTASection } from '@/components/CTASection';

export const metadata = { title: 'Giới thiệu' };

export default function AboutPage() {
  return (
    <main>
      <section className="bg-brand-light py-20 lg:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Về CAREVIA</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
          CAREVIA tự hào là đơn vị tiên phong cung cấp giải pháp y tế tại nhà và vận chuyển bệnh nhân chuyên nghiệp, tận tâm nhất.
        </p>
      </section>
      
      <section className="py-24 bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg text-slate-600 mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tầm nhìn & Sứ mệnh</h2>
          <p className="mb-6">
            Với mong muốn mang đến những dịch vụ y tế và vận chuyển bệnh nhân an toàn, chất lượng nhất, CAREVIA luôn nỗ lực không ngừng cải tiến và nâng cao tiêu chuẩn phục vụ.
          </p>
          <p className="mb-12">
            Chúng tôi tin rằng, mỗi bệnh nhân đều xứng đáng nhận được sự chăm sóc tận tâm như chính người thân trong gia đình.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="border border-slate-200 p-6 rounded-xl bg-slate-50">
              <h3 className="font-bold text-brand-primary mb-2">1. Tận tâm</h3>
              <p className="text-sm">Phục vụ khách hàng bằng cả trái tim, đặt sức khỏe bệnh nhân lên hàng đầu.</p>
            </div>
            <div className="border border-slate-200 p-6 rounded-xl bg-slate-50">
              <h3 className="font-bold text-brand-primary mb-2">2. An toàn</h3>
              <p className="text-sm">Trang thiết bị y tế hiện đại, đảm bảo an toàn tuyệt đối trên mọi nẻo đường.</p>
            </div>
            <div className="border border-slate-200 p-6 rounded-xl bg-slate-50">
              <h3 className="font-bold text-brand-primary mb-2">3. Nhanh chóng</h3>
              <p className="text-sm">Quy trình điều phối thông minh, cam kết có mặt kịp thời trong thời gian ngắn nhất.</p>
            </div>
            <div className="border border-slate-200 p-6 rounded-xl bg-slate-50">
              <h3 className="font-bold text-brand-primary mb-2">4. Chuyên nghiệp</h3>
              <p className="text-sm">Đội ngũ y bác sĩ, điều dưỡng và tài xế giàu kinh nghiệm, chuyên môn cao.</p>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </main>
  );
}
