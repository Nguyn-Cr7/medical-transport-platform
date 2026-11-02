import React from "react";
import type { Metadata } from "next";
import { ContactMessageManager } from "@/components/admin/ContactMessageManager";

export const metadata: Metadata = {
  title: "Tin Nhắn Liên Hệ | Admin CAREVIA",
};

export default function AdminContactPage() {
  return <ContactMessageManager />;
}
