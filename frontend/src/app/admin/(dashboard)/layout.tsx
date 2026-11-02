import React from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getUnreadContactCountAction } from "./contact/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const unreadCount = await getUnreadContactCountAction();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <AdminSidebar
        userEmail={user.email || "admin@carevia.vn"}
        initialUnreadCount={unreadCount}
      />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

