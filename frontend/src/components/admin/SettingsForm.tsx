"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Save,
  ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { SiteSettings } from "@/types/content";
import { MediaPicker } from "./MediaPicker";
import { updateSiteSettingsAction } from "@/app/admin/(dashboard)/settings/actions";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const validate = (): string | null => {
    if (!formData.companyName.trim()) {
      return "Tên công ty không được để trống.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return "Địa chỉ email không đúng định dạng.";
    }

    const phoneRegex = /^[0-9\s+\-()]{6,25}$/;
    if (formData.hotline && !phoneRegex.test(formData.hotline.trim())) {
      return "Số Hotline chỉ được chứa số, khoảng trắng hoặc dấu +, -, (, ).";
    }
    if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
      return "Số điện thoại chỉ được chứa số, khoảng trắng hoặc dấu +, -, (, ).";
    }

    const checkUrl = (url?: string | null, name?: string) => {
      if (!url || !url.trim()) return null;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `Đường dẫn ${name} phải bắt đầu bằng https:// hoặc http://`;
      }
      return null;
    };

    const zaloErr = checkUrl(formData.zaloUrl, "Zalo");
    if (zaloErr) return zaloErr;

    const fbErr = checkUrl(formData.facebookUrl, "Facebook");
    if (fbErr) return fbErr;

    const ytErr = checkUrl(formData.youtubeUrl, "YouTube");
    if (ytErr) return ytErr;

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const valErr = validate();
    if (valErr) {
      setErrorMessage(valErr);
      return;
    }

    setLoading(true);
    try {
      const res = await updateSiteSettingsAction(formData);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error("[SettingsForm] Submit error:", err);
      setErrorMessage("Đã xảy ra lỗi khi lưu cấu hình.");
    } finally {
      setLoading(false);
    }
  };

  const isZaloWarning =
    Boolean(formData.zaloUrl) && !formData.zaloUrl.startsWith("https://zalo.me/");

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Nhận diện thương hiệu & Logo */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>1. Nhận diện thương hiệu & Logo</span>
        </h2>

        {/* Logo preview and picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Logo Website
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-48 h-20 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden">
              <Image
                src={formData.logoUrl || "/branding/logo-carevia.png"}
                alt="Logo Preview"
                width={160}
                height={40}
                className="max-h-full w-auto object-contain"
                unoptimized
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ImageIcon size={15} />
                  Chọn logo từ thư viện ảnh
                </button>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: null })}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Dùng logo mặc định
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Nếu để trống, website sẽ tự động dùng logo gốc: <code className="text-slate-600">/branding/logo-carevia.png</code>
              </p>
            </div>
          </div>
        </div>

        {/* Company Name & Slogan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Công Ty / Đơn Vị <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Khẩu Hiệu (Slogan)
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Hotline & Thông tin liên hệ */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Thông tin liên hệ & Kênh hỗ trợ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Hotline (Hiển thị Header, Footer, Nút gọi) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.hotline}
              onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
              placeholder="1900 888 999"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Link cuộc gọi sẽ tự động loại bỏ khoảng trắng khi khách bấm gọi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Điện Thoại Phụ / Di Động
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0986767960"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Liên Hệ
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="lienhe@carevia.vn"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Thời Gian Làm Việc
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="24/7 (Tất cả các ngày trong tuần)"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Địa Chỉ Trụ Sở
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Số 123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
          />
        </div>
      </div>

      {/* 3. Mạng xã hội & Kênh Zalo */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          3. Mạng xã hội & Kênh Zalo
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Đường Dẫn Zalo Mặc Định <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.zaloUrl}
            onChange={(e) => setFormData({ ...formData, zaloUrl: e.target.value })}
            placeholder="https://zalo.me/0986767960"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900 font-mono"
          />
          {isZaloWarning && (
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
              <HelpCircle size={12} />
              Gợi ý: Link Zalo nên có định dạng https://zalo.me/số_điện_thoại để mở ứng dụng Zalo trực tiếp.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Facebook URL
            </label>
            <input
              type="text"
              value={formData.facebookUrl || ""}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/carevia"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              YouTube URL
            </label>
            <input
              type="text"
              value={formData.youtubeUrl || ""}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/@carevia"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 4. Nội dung Footer */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          4. Đoạn giới thiệu Footer
        </h2>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mô tả tóm tắt chân trang
          </label>
          <textarea
            rows={3}
            value={formData.footerText || ""}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            placeholder="Giải pháp toàn diện về chăm sóc y tế tại nhà và vận chuyển bệnh nhân an toàn..."
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer text-sm"
        >
          <Save size={18} />
          <span>{loading ? "Đang lưu cấu hình..." : "LƯU CẤU HÌNH WEBSITE"}</span>
        </button>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, logoUrl: url })}
        title="Chọn Logo Cho Website"
      />
    </form>
  );
}

