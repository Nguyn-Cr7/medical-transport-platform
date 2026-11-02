import React from "react";
import type { Metadata } from "next";
import { ServiceListManager } from "@/components/admin/ServiceListManager";

export const metadata: Metadata = {
  title: "Quản lý Dịch vụ Vận chuyển | Admin CAREVIA",
};

export default function AdminTransportPage() {
  return <ServiceListManager category="transport" />;
}
