"use client";

import React, { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    website: "", // Honeypot field
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return "Họ và tên phải từ 2 đến 100 ký tự.";
    }

    const trimmedPhone = formData.phone.trim().replace(/\s+/g, "");
    const phoneRegex = /^(0|\+84)[0-9]{8,15}$/;
    if (!phoneRegex.test(trimmedPhone) || trimmedPhone.length < 8 || trimmedPhone.length > 20) {
      return "Vui lòng nhập số điện thoại hợp lệ (từ 8 đến 20 số).";
    }

    const trimmedMessage = formData.message.trim();
    if (trimmedMessage.length < 5 || trimmedMessage.length > 2000) {
      return "Nội dung tin nhắn cần tối thiểu 5 ký tự và tối đa 2000 ký tự.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Honeypot check: bot filled it
    if (formData.website) {
      setStatus("success");
      setFormData({ name: "", phone: "", message: "", website: "" });
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setStatus("submitting");

    try {
      if (!isSupabaseConfigured()) {
        // Fallback simulation when Supabase is not configured
        console.warn("[ContactForm] Supabase is not configured. Simulating success.");
        await new Promise((r) => setTimeout(r, 600));
        setStatus("success");
        setFormData({ name: "", phone: "", message: "", website: "" });
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      if (error) {
        console.error("[ContactForm] Error inserting message:", error);
        setStatus("error");
        setErrorMessage("Không thể gửi thông tin lúc này. Vui lòng liên hệ trực tiếp qua Hotline hoặc Zalo.");
        return;
      }

      setStatus("success");
      setFormData({ name: "", phone: "", message: "", website: "" });
    } catch (err) {
      console.error("[ContactForm] Unexpected error:", err);
      setStatus("error");
      setErrorMessage("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <p className="font-bold mb-1">Gửi thông tin thành công!</p>
          <p>Cảm ơn bạn đã liên hệ. Đội ngũ CAREVIA sẽ phản hồi sớm nhất có thể.</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Họ và tên <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-slate-900"
          placeholder="Nhập họ và tên..."
          disabled={status === "submitting"}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          Số điện thoại <span className="text-rose-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-slate-900"
          placeholder="Nhập số điện thoại (ví dụ: 0988123456)..."
          disabled={status === "submitting"}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
          Nội dung <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-slate-900"
          placeholder="Nhập nội dung cần tư vấn..."
          disabled={status === "submitting"}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "ĐANG GỬI THÔNG TIN..." : "GỬI THÔNG TIN"}
      </button>
    </form>
  );
}

