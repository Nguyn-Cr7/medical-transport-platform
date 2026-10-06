import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { COMPANY_INFO } from '@/data/companyInfo';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_INFO.name} - Y Tế Tại Nhà & Vận Chuyển Y Tế`,
    template: `%s | ${COMPANY_INFO.name}`,
  },
  description: COMPANY_INFO.slogan,
  keywords: [
    'dịch vụ y tế tại nhà',
    'chăm sóc người bệnh',
    'vận chuyển bệnh nhân',
    'xe cứu thương đưa đón',
    'tái khám bệnh viện',
    'tuyển dụng cộng tác viên y tế',
    'cộng tác viên tài xế part-time',
  ],
  openGraph: {
    title: COMPANY_INFO.name,
    description: COMPANY_INFO.slogan,
    siteName: COMPANY_INFO.name,
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950`}>
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
