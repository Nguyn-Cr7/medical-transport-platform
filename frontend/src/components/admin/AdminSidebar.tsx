"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Ambulance,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Settings,
  ExternalLink,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { AdminLogoutButton } from "./AdminLogoutButton";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Dịch vụ y tế",
    href: "/admin/medical",
    icon: Stethoscope,
  },
  {
    name: "Dịch vụ vận chuyển",
    href: "/admin/transport",
    icon: Ambulance,
  },
  {
    name: "Tin tức",
    href: "/admin/posts",
    icon: FileText,
    badge: "GĐ5",
  },
  {
    name: "Tuyển dụng",
    href: "/admin/jobs",
    icon: Briefcase,
    badge: "GĐ5",
  },
  {
    name: "Quản lý hình ảnh",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    name: "Tin nhắn liên hệ",
    href: "/admin/contact",
    icon: Mail,
    badge: "GĐ5",
  },
  {
    name: "Cấu hình website",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export function AdminSidebar({ userEmail = "admin@carevia.vn" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand logo & portal title */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/branding/logo-carevia.png"
            alt="CAREVIA"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-light text-brand-primary">
          Admin
        </span>
      </div>

      {/* Navigation list */}
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Quản Lý Hệ Thống
        </div>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/30"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* External website link */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-primary hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            Xem website CAREVIA
          </span>
          <span className="text-[10px] text-slate-400">Mở tab mới ↗</span>
        </Link>
      </div>

      {/* User profile & logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
            <Shield size={16} />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-900 truncate">{userEmail}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Quản trị viên
            </div>
          </div>
        </div>
        <AdminLogoutButton className="w-full justify-center bg-white border border-slate-200 hover:bg-rose-50" />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top toggle */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/admin">
          <Image
            src="/branding/logo-carevia.png"
            alt="CAREVIA Admin"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Mở menu quản trị"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>
    </>
  );
}

