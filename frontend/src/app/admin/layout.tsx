import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản Trị Hệ Thống | CAREVIA",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-100 text-slate-800">{children}</div>;
}

