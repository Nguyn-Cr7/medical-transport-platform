import React from "react";
import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = {
  title: "Viết Bài Mới | Admin CAREVIA",
};

export default function AdminNewPostPage() {
  return <PostForm />;
}

