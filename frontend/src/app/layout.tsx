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
    default: `CAREVIA - Y Tế Tại Nhà & Vận Chuyển Y Tế`,
    template: `%s | CAREVIA`,
  },
  description: COMPANY_INFO.slogan,
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'CAREVIA',
    description: COMPANY_INFO.slogan,
    siteName: 'CAREVIA',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-800 antialiased min-h-screen flex flex-col justify-between selection:bg-brand-secondary selection:text-white`}>
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
