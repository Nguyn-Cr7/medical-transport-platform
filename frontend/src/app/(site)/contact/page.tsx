import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSettings } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Liên hệ",
  description: "Liên hệ CAREVIA - Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const cleanHotline = settings.hotline.replace(/\s+/g, "");

  return (
    <main className="bg-white">
      <section className="bg-brand-light py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Liên hệ CAREVIA</h1>
        <p className="text-slate-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Real Settings */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Thông tin liên hệ</h2>
          <div className="space-y-6 text-slate-600">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-brand-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Hotline</h4>
                <p>
                  <a href={`tel:${cleanHotline}`} className="hover:text-brand-primary font-medium">
                    {settings.hotline}
                  </a>{" "}
                  <span className="text-sm text-slate-500">({settings.workingHours})</span>
                </p>
                {settings.phone && (
                  <p className="text-sm mt-0.5">
                    Điện thoại:{" "}
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-brand-primary">
                      {settings.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-brand-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Email</h4>
                <p>
                  <a href={`mailto:${settings.email}`} className="hover:text-brand-primary">
                    {settings.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-brand-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Trụ sở</h4>
                <p>{settings.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
