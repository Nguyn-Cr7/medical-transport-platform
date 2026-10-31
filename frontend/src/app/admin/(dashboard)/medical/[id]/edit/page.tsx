import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { getAdminServiceByIdAction } from "@/app/admin/(dashboard)/services/actions";

interface EditMedicalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Chỉnh Sửa Dịch Vụ Y Tế | Admin CAREVIA",
};

export default async function AdminEditMedicalPage({ params }: EditMedicalPageProps) {
  const { id } = await params;
  const res = await getAdminServiceByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <ServiceForm
      category="medical"
      initialData={res.data}
      serviceId={id}
    />
  );
}

