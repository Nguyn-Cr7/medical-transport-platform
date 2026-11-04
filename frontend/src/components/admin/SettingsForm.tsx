"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Save,
  ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  Clock,
} from "lucide-react";
import type { SiteSettings } from "@/types/content";
import { MediaPicker } from "./MediaPicker";
import { updateSiteSettingsAction } from "@/app/admin/(dashboard)/settings/actions";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettings>({
    ...initialSettings,
    heroImages: initialSettings.heroImages || [],
    heroIntervalSeconds: initialSettings.heroIntervalSeconds || 5,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [heroMediaPickerOpen, setHeroMediaPickerOpen] = useState(false);

  const addHeroImage = (url: string) => {
    if ((formData.heroImages || []).length >= 8) {
      setErrorMessage("Tối đa 8 ảnh trình chiếu trang chủ.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      heroImages: [...(prev.heroImages || []), { url, alt: "" }],
    }));
  };

  const removeHeroImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      heroImages: (prev.heroImages || []).filter((_, idx) => idx !== index),
    }));
  };

  const moveHeroImage = (index: number, direction: "up" | "down") => {
    const list = [...(formData.heroImages || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, heroImages: list }));
  };

  const updateHeroImageAlt = (index: number, alt: string) => {
    const list = [...(formData.heroImages || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], alt };
    setFormData((prev) => ({ ...prev, heroImages: list }));
  };

  const validate = (): string | null => {
    if (!formData.companyName.trim()) {
      return "Tên công ty không được để trống.";
    }

    if (
      typeof formData.heroIntervalSeconds === "number" &&
      (formData.heroIntervalSeconds < 2 || formData.heroIntervalSeconds > 30)
    ) {
      return "Thời gian chuyển ảnh phải từ 2 đến 30 giây.";
    }

    if ((formData.heroImages || []).length > 8) {
      return "Tối đa 8 ảnh trình chiếu trang chủ.";
    }

    for (let i = 0; i < (formData.heroImages || []).length; i++) {
      const img = formData.heroImages[i];
      if (img.alt && img.alt.length > 150) {
        return `Mô tả ảnh thứ ${i + 1} vượt quá 150 ký tự.`;
      }
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

      {/* 2. Ảnh trình chiếu trang chủ (Hero Slideshow) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>2. Ảnh trình chiếu trang chủ (Hero Slideshow)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thay thế khung ảnh Hero ở trang chủ. Hiển thị trình chiếu tự động hoặc ảnh tĩnh.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {(formData.heroImages || []).length}/8 ảnh
          </span>
        </div>

        {/* Suggestion banner */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Gợi ý kích thước & định dạng:</p>
            <p className="text-blue-700 mt-0.5">
              Nên dùng ảnh có tỷ lệ <strong>4:3</strong> (khoảng 1200 × 900px), dung lượng dưới <strong>500KB</strong>. Nên dùng cùng kích thước cho mọi ảnh để khung hiển thị đồng đều nhất (Tối đa 8 ảnh).
            </p>
          </div>
        </div>

        {/* Interval setting */}
        <div className="max-w-xs">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500" />
            <span>Thời gian chuyển ảnh (giây)</span>
          </label>
          <input
            type="number"
            min={2}
            max={30}
            step={1}
            value={formData.heroIntervalSeconds || 5}
            onChange={(e) =>
              setFormData({
                ...formData,
                heroIntervalSeconds: parseInt(e.target.value) || 5,
              })
            }
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-slate-900 font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1">Từ 2 đến 30 giây (mặc định: 5 giây).</p>
        </div>

        {/* Image Grid / List */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Danh sách ảnh trình chiếu
          </label>

          {(formData.heroImages || []).length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
              <p className="text-sm text-slate-500 mb-4">
                Chưa có ảnh nào. Trang chủ sẽ hiển thị khung mặc định (&quot;Healthcare Image Placeholder&quot;).
              </p>
              <button
                type="button"
                onClick={() => setHeroMediaPickerOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                Thêm ảnh đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {formData.heroImages.map((img, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between space-y-3 relative group/card"
                >
                  <div className="space-y-2">
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 border border-slate-300/60">
                      <Image
                        src={img.url}
                        alt={img.alt || `Hero slide ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Alt input */}
                    <div>
                      <input
                        type="text"
                        maxLength={150}
                        placeholder="Mô tả ảnh (alt cho SEO)..."
                        value={img.alt || ""}
                        onChange={(e) => updateHeroImageAlt(idx, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-brand-primary placeholder:text-slate-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
                        <span>Mô tả ảnh</span>
                        <span>{(img.alt || "").length}/150</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Move Up, Move Down, Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveHeroImage(idx, "up")}
                        title="Di chuyển lên trước"
                        aria-label="Di chuyển lên trước"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-200/80 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.heroImages.length - 1}
                        onClick={() => moveHeroImage(idx, "down")}
                        title="Di chuyển xuống sau"
                        aria-label="Di chuyển xuống sau"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-200/80 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeHeroImage(idx)}
                      title="Xóa ảnh này"
                      aria-label="Xóa ảnh này"
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add button slot if < 8 */}
              {formData.heroImages.length < 8 && (
                <button
                  type="button"
                  onClick={() => setHeroMediaPickerOpen(true)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-brand-primary/30 hover:border-brand-primary bg-brand-light/30 hover:bg-brand-light/60 rounded-2xl min-h-[200px] p-4 text-brand-primary transition-all cursor-pointer group"
                >
                  <Plus size={24} className="mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">+ Thêm ảnh</span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    ({8 - formData.heroImages.length} slot còn lại)
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Hotline & Thông tin liên hệ */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          3. Thông tin liên hệ & Kênh hỗ trợ
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

      {/* 4. Mạng xã hội & Kênh Zalo */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          4. Mạng xã hội & Kênh Zalo
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

      {/* 5. Nội dung Footer */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          5. Đoạn giới thiệu Footer
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

      {/* Media Picker for Logo */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, logoUrl: url })}
        title="Chọn Logo Cho Website"
      />

      {/* Media Picker for Hero Slideshow */}
      <MediaPicker
        isOpen={heroMediaPickerOpen}
        onClose={() => setHeroMediaPickerOpen(false)}
        onSelect={(url) => {
          addHeroImage(url);
          setHeroMediaPickerOpen(false);
        }}
        title="Chọn Ảnh Trình Chiếu Trang Chủ"
      />
    </form>
  );
}

