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
  Phone,
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

  // 2. Posts (Total, Published, Draft, Scheduled)
  const { data: posts } = await supabase
    .from("posts")
    .select("status, published_at");
  const now = new Date();
  const postsScheduled =
    posts?.filter(
      (p) =>
        p.status === "published" &&
        p.published_at &&
        new Date(p.published_at) > now
    ).length || 0;
  const postsPublished =
    posts?.filter(
      (p) =>
        p.status === "published" &&
        (!p.published_at || new Date(p.published_at) <= now)
    ).length || 0;
  const postsDraft = posts?.filter((p) => p.status === "draft").length || 0;
  const postsTotal = posts?.length || 0;

  // 3. Jobs (Total, Open, Closed)
  const { data: jobs } = await supabase.from("jobs").select("status");
  const jobsOpen = jobs?.filter((j) => j.status === "open").length || 0;
  const jobsClosed = jobs?.filter((j) => j.status === "closed").length || 0;
  const jobsTotal = jobs?.length || 0;

  // 4. Contact messages (Total, Unread, Latest 5)
  const { count: unreadCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  const { count: totalContactCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

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

      {/* Unread Messages Alert Banner */}
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
          <Link
            href="/admin/contact"
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Mở hộp thư →
          </Link>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Medical Services */}
        <Link
          href="/admin/medical"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
              Dịch Vụ Y Tế
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1.5">
            {medicalPublished}
            <span className="text-xs font-medium text-slate-400">/{medicalTotal}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            Đã xuất bản {medicalPublished} dịch vụ
          </div>
        </Link>

        {/* Transport Services */}
        <Link
          href="/admin/transport"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-700 transition-colors">
              Dịch Vụ Vận Tải
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ambulance size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1.5">
            {transportPublished}
            <span className="text-xs font-medium text-slate-400">/{transportTotal}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            Đã xuất bản {transportPublished} tuyến xe
          </div>
        </Link>

        {/* Posts */}
        <Link
          href="/admin/posts"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
              Tin Tức
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1.5">
            {postsTotal}
            <span className="text-xs font-medium text-slate-400"> bài viết</span>
          </div>
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">{postsPublished} đã đăng</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">{postsDraft} nháp</span>
            </div>
            {postsScheduled > 0 && (
              <div className="text-blue-600 font-semibold text-[10px]">
                ⏱ {postsScheduled} bài hẹn giờ
              </div>
            )}
          </div>
        </Link>

        {/* Jobs */}
        <Link
          href="/admin/jobs"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-700 transition-colors">
              Tuyển Dụng
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1.5">
            {jobsTotal}
            <span className="text-xs font-medium text-slate-400"> vị trí</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{jobsOpen} đang mở</span>
            <span>•</span>
            <span className="text-slate-400 font-semibold">{jobsClosed} đã đóng</span>
          </div>
        </Link>

        {/* Contact Messages */}
        <Link
          href="/admin/contact"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-700 transition-colors">
              Tin Nhắn Liên Hệ
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1.5">
            {totalContactCount || 0}
            <span className="text-xs font-medium text-slate-400"> tin nhắn</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-rose-600 font-semibold">
              {unreadCount || 0} chưa đọc
            </span>
            <span>•</span>
            <span className="text-slate-500">
              {(totalContactCount || 0) - (unreadCount || 0)} đã đọc
            </span>
          </div>
        </Link>
      </div>

      {/* Latest 5 Contact Messages */}
      <div id="latest-messages" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tin Nhắn Liên Hệ Mới Nhất
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 yêu cầu tư vấn gần đây nhất từ khách hàng qua trang liên hệ website
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1.5 rounded-full">
              Chưa đọc: {unreadCount || 0}
            </span>
            <Link
              href="/admin/contact"
              className="text-xs font-bold text-slate-700 hover:text-brand-primary hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              Xem tất cả →
            </Link>
          </div>
        </div>

        {(!latestMessages || latestMessages.length === 0) ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Chưa có tin nhắn liên hệ nào từ khách hàng.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {latestMessages.map((msg) => (
              <div
                key={msg.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/60 p-3 rounded-xl transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-xs font-medium text-brand-primary hover:underline bg-slate-100 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1"
                    >
                      <Phone size={11} /> {msg.phone}
                    </a>
                    {!msg.is_read ? (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                        Chưa đọc
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        Đã đọc
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
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
                  <Link
                    href="/admin/contact"
                    className="text-xs font-medium text-brand-primary hover:underline"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {latestMessages && latestMessages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-500">
              Tổng cộng {totalContactCount || 0} tin nhắn trong cơ sở dữ liệu
            </span>
            <Link
              href="/admin/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-dark transition-colors py-2 px-4 rounded-xl shadow-sm"
            >
              Xem tất cả tin nhắn →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/posts/new"
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Soạn thảo
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              + Viết bài tin tức mới
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Trình soạn thảo WYSIWYG, chèn ảnh, hẹn giờ đăng bài.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            Mở trình soạn thảo <ArrowRight size={13} className="ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/jobs/new"
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tuyển dụng
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              + Đăng tin tuyển dụng
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Thêm vị trí, hình thức, yêu cầu và quyền lợi linh hoạt.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-0.5 transition-transform">
            Đăng vị trí mới <ArrowRight size={13} className="ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Kho media
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
              Thư viện hình ảnh
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload ảnh, duyệt thư viện và sao chép URL trên Supabase.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-brand-primary group-hover:translate-x-0.5 transition-transform">
            Quản lý tệp <ArrowRight size={13} className="ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Cài đặt
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
              Cấu hình website
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hotline, Zalo, địa chỉ và thông tin liên hệ toàn website.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-brand-primary group-hover:translate-x-0.5 transition-transform">
            Cập nhật cấu hình <ArrowRight size={13} className="ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}

