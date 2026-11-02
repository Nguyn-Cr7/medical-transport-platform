import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { COMPANY_INFO } from "@/data/companyInfo";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: `CAREVIA - Y Tế Tại Nhà & Vận Chuyển Y Tế`,
    template: `%s | CAREVIA`,
  },
  description: COMPANY_INFO.slogan,
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "CAREVIA",
    description: COMPANY_INFO.slogan,
    siteName: "CAREVIA",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-slate-800 antialiased min-h-screen selection:bg-brand-secondary selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
