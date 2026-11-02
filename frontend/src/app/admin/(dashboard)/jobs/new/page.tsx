import React from "react";
import type { Metadata } from "next";
import { JobForm } from "@/components/admin/JobForm";

export const metadata: Metadata = {
  title: "Thêm Vị Trí Tuyển Dụng | Admin CAREVIA",
};

export default function AdminNewJobPage() {
  return <JobForm />;
}

