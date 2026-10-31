import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
      <FloatingContact />
    </div>
  );
}

