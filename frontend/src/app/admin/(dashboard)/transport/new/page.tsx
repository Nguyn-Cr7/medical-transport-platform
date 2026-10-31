import React from "react";
import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = {
  title: "Thêm Dịch Vụ Vận Chuyển Mới | Admin CAREVIA",
};

export default function AdminNewTransportPage() {
  return <ServiceForm category="transport" />;
}

