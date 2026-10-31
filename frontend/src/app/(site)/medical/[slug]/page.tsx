import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle, CheckCircle2 } from "lucide-react";
import { getService, getServices, getSettings } from "@/lib/content";
import { PriceImageGallery } from "@/components/PriceImageGallery";
import { CTASection } from "@/components/CTASection";

interface MedicalDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const services = await getServices("medical");
  return services
    .filter((s) => s.actionType === "detail_page")
    .map((s) => ({
      slug: s.slug,
    }));
}

export async function generateMetadata({
  params,
}: MedicalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service || service.actionType !== "detail_page") {
    return { title: "Dịch vụ không tồn tại" };
  }

  return {
    title: `${service.title} | Bảng Giá & Chi Tiết | CAREVIA`,
    description: service.shortDesc || service.fullDesc,
  };
}

export default async function MedicalDetailPage({ params }: MedicalDetailPageProps) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getService(slug),
    getSettings(),
  ]);

  // Only allow services with action_type = 'detail_page'
  if (!service || service.actionType !== "detail_page") {
    notFound();
  }

  const zaloUrl = service.zaloUrl || settings.zaloUrl || "https://zalo.me/0986767960";

  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="bg-brand-light py-12 lg:py-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/medical"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Quay lại danh sách dịch vụ y tế
          </Link>
          <div className="inline-block bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Bảng giá chi tiết
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {service.fullDesc || service.shortDesc}
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features / "Bao gồm" */}
        {service.features && service.features.length > 0 && (
          <div className="mb-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-brand-secondary" size={22} />
              Dịch vụ bao gồm
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 text-sm">
              {service.features.map((feat: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-brand-secondary font-bold text-base leading-none">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            {service.targetInfo && (
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
                <strong>Đối tượng phù hợp:</strong> {service.targetInfo}
              </div>
            )}
          </div>
        )}

        {/* Section: Bảng giá dịch vụ */}
        <div className="mb-12">
          <div className="text-center sm:text-left mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Bảng Giá Dịch Vụ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hình ảnh chi tiết gói dịch vụ và các hạng mục xét nghiệm
            </p>
          </div>

          {/* Price Images in 2 Balanced Frames with Lightbox */}
          <PriceImageGallery images={service.priceImages || []} title={service.title} />

          {/* Action CTA */}
          <div className="mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all text-base"
            >
              <MessageCircle size={20} />
              LIÊN HỆ BÁO GIÁ QUA ZALO
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition-colors text-base"
            >
              Gửi thông tin tư vấn
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}

