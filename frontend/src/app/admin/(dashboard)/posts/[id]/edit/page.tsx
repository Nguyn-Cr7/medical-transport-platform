import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getAdminPostByIdAction } from "@/app/admin/(dashboard)/posts/actions";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Chỉnh Sửa Bài Viết | Admin CAREVIA",
};

export default async function AdminEditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const res = await getAdminPostByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <PostForm initialData={res.data} postId={id} />;
}

