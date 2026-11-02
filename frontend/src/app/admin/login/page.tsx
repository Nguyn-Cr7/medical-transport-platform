import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { verifyAdmin } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng Nhập Quản Trị | CAREVIA",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const { user, isAdmin } = await verifyAdmin();

  if (user && isAdmin) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/branding/logo-carevia.png"
              alt="CAREVIA Logo"
              width={180}
              height={45}
              className="h-11 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> Hệ Thống Quản Trị
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Đăng Nhập Bảng Điều Khiển
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Vui lòng đăng nhập bằng tài khoản quản trị viên CAREVIA
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <AdminLoginForm unauthorized={error === "unauthorized"} />
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={14} /> Trở về trang chủ CAREVIA
          </Link>
        </div>
      </div>
    </div>
  );
}

