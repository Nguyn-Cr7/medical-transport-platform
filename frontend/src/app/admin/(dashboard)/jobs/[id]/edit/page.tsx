import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/JobForm";
import { getAdminJobByIdAction } from "@/app/admin/(dashboard)/jobs/actions";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Chỉnh Sửa Vị Trí Tuyển Dụng | Admin CAREVIA",
};

export default async function AdminEditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const res = await getAdminJobByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <JobForm initialData={res.data} jobId={id} />;
}

