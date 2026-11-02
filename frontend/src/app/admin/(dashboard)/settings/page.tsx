import React from "react";
import { getSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Cấu Hình Website
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chỉnh sửa thông tin công ty, hotline, số điện thoại, link Zalo và mạng xã hội đồng bộ trên toàn website.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

