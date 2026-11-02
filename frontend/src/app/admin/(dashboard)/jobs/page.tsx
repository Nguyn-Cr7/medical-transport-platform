import React from "react";
import type { Metadata } from "next";
import { JobListManager } from "@/components/admin/JobListManager";

export const metadata: Metadata = {
  title: "Quản lý Tuyển Dụng | Admin CAREVIA",
};

export default function AdminJobsPage() {
  return <JobListManager />;
}
