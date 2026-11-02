import React from "react";
import type { Metadata } from "next";
import { ServiceListManager } from "@/components/admin/ServiceListManager";

export const metadata: Metadata = {
  title: "Quản lý Dịch vụ Y tế | Admin CAREVIA",
};

export default function AdminMedicalPage() {
  return <ServiceListManager category="medical" />;
}
