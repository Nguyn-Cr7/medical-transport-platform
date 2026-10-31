import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Ambulance,
  FileText,
  Briefcase,
  Mail,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Services
  const { data: services } = await supabase
    .from("services")
    .select("category, is_published");

  const medicalTotal = services?.filter((s) => s.category === "medical").length || 0;
  const medicalPublished =
    services?.filter((s) => s.category === "medical" && s.is_published).length || 0;

  const transportTotal = services?.filter((s) => s.category === "transport").length || 0;
  const transportPublished =
    services?.filter((s) => s.category === "transport" && s.is_published).length || 0;

  // 2. Posts
  const { data: posts } = await supabase.from("posts").select("status");
  const postsPublished = posts?.filter((p) => p.status === "published").length || 0;
  const postsDraft = posts?.filter((p) => p.status === "draft").length || 0;

  // 3. Jobs
  const { data: jobs } = await supabase.from("jobs").select("status");
  const jobsOpen = jobs?.filter((j) => j.status === "open").length || 0;
  const jobsClosed = jobs?.filter((j) => j.status === "closed").length || 0;

  // 4. Contact messages
  const { count: unreadCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  const { data: latestMessages } = await supabase
    .from("contact_messages")
    .select("id, name, phone, message, created_at, is_read")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-brand-primary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-3">
            <Sparkles size={14} /> Hệ thống Quản Trị CMS CAREVIA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào mừng trở lại!
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Tổng quan tình trạng dữ liệu, tin nhắn khách hàng và dịch vụ trên toàn hệ thống website.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="bg-white text-brand-primary hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow shrink-0"
        >
          Cấu hình website →
        </Link>
      </div>

      {/* Unread Messages Highlight Alert */}
      {(unreadCount || 0) > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-sm sm:text-base">
                Có {unreadCount} tin nhắn liên hệ mới chưa đọc
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Khách hàng đang chờ phản hồi từ đội ngũ tư vấn CAREVIA
              </p>
            </div>
          </div>
          <a
            href="#latest-messages"
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Xem tin nhắn ↓
          </a>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Medical Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dịch Vụ Y Tế
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">
            {medicalPublished}
            <span className="text-sm font-medium text-slate-400">/{medicalTotal}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Đã xuất bản {medicalPublished} dịch vụ
          </div>
        </div>

        {/* Transport Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dịch Vụ Vận Tải
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ambulance size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">
            {transportPublished}
            <span className="text-sm font-medium text-slate-400">/{transportTotal}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Đã xuất bản {transportPublished} tuyến xe
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tin Tức & Bài Viết
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">
            {postsPublished}
            <span className="text-sm font-medium text-slate-400">/{postsPublished + postsDraft}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="text-indigo-600 font-semibold">{postsPublished} đã đăng</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{postsDraft} nháp</span>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tuyển Dụng
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">
            {jobsOpen}
            <span className="text-sm font-medium text-slate-400">/{jobsOpen + jobsClosed}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">{jobsOpen} đang mở</span>
            <span>•</span>
            <span className="text-slate-400 font-semibold">{jobsClosed} đã đóng</span>
          </div>
        </div>
      </div>

      {/* Latest 5 Contact Messages */}
      <div id="latest-messages" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tin Nhắn Liên Hệ Mới Nhất
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 yêu cầu tư vấn gần đây nhất từ khách hàng qua trang liên hệ
            </p>
          </div>
          <span className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1.5 rounded-full">
            Chưa đọc: {unreadCount || 0}
          </span>
        </div>

        {(!latestMessages || latestMessages.length === 0) ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Chưa có tin nhắn liên hệ nào từ khách hàng.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {latestMessages.map((msg) => (
              <div key={msg.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-xs font-medium text-brand-primary hover:underline bg-slate-100 px-2.5 py-0.5 rounded-md"
                    >
                      📞 {msg.phone}
                    </a>
                    {!msg.is_read && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Clock size={12} />
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links to Upcoming Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/admin/media"
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Thư viện phương tiện
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
              Quản lý hình ảnh & Tệp tải lên
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tải lên, xem lưới ảnh và sao chép đường dẫn ảnh lưu trữ trên Supabase.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Thông tin công ty
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
              Cấu hình thông tin & Hotline website
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Cập nhật hotline, số điện thoại, link Zalo và địa chỉ đồng bộ toàn trang.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>
      </div>
    </div>
  );
}

