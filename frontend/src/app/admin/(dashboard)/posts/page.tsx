import React from "react";
import type { Metadata } from "next";
import { PostListManager } from "@/components/admin/PostListManager";

export const metadata: Metadata = {
  title: "Quản lý Tin Tức | Admin CAREVIA",
};

export default function AdminPostsPage() {
  return <PostListManager />;
}
