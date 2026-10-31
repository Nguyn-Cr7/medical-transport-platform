import React from "react";
import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = {
  title: "Thêm Dịch Vụ Y Tế Mới | Admin CAREVIA",
};

export default function AdminNewMedicalPage() {
  return <ServiceForm category="medical" />;
}

