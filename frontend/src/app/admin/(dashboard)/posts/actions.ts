"use server";

import { verifyAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath, updateTag } from "next/cache";
import { isValidSlug, slugify } from "@/lib/slugify";
import { sanitizeHtml } from "@/lib/sanitize";
import { estimateReadTime } from "@/lib/content";
import type { PostItem, PostCategory, PostStatus } from "@/types/content";

export interface PostInput {
  title: string;
  slug: string;
  category: PostCategory;
  excerpt?: string;
  content: string;
  coverImageUrl?: string | null;
  author?: string;
  status: PostStatus;
  publishedAt?: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface DbPostRecord {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<PostCategory, string> = {
  medical: "Y Tế Tại Nhà",
  transport: "Vận Tải Y Tế",
  company: "Tin Doanh Nghiệp",
};

function mapDbToPostItem(d: DbPostRecord): PostItem {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    category: d.category,
    categoryLabel: CATEGORY_LABELS[d.category] || "Tin Tức",
    excerpt: d.excerpt || "",
    content: d.content || "",
    coverImageUrl: d.cover_image_url || null,
    author: d.author || "CAREVIA",
    status: d.status,
    publishedAt: d.published_at ? d.published_at.substring(0, 10) : "",
    readTime: estimateReadTime(d.content),
  };
}

function triggerPostsRevalidation(slug?: string, oldSlug?: string) {
  try {
    updateTag("posts");
    revalidateTag("posts", "max");
    revalidatePath("/news");
    revalidatePath("/");

    if (slug) {
      revalidatePath(`/news/${slug}`);
    }
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/news/${oldSlug}`);
    }
  } catch (err) {
    console.warn("[PostsAction] Revalidation note:", err);
  }
}

/**
 * Lấy danh sách bài viết dành cho Admin (Bao gồm Nháp & Đã Đăng, hỗ trợ tìm kiếm và lọc)
 */
export async function getAdminPostsAction(filters?: {
  category?: PostCategory;
  status?: PostStatus;
  search?: string;
}): Promise<ActionResult<PostItem[]>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.search && filters.search.trim()) {
    query = query.ilike("title", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[PostsAction] Error fetching admin posts:", error);
    return {
      success: false,
      message: "Không thể tải danh sách bài viết: " + error.message,
    };
  }

  const items = (data as DbPostRecord[]).map(mapDbToPostItem);
  return {
    success: true,
    message: "Tải danh sách bài viết thành công.",
    data: items,
  };
}

/**
 * Lấy chi tiết một bài viết theo ID
 */
export async function getAdminPostByIdAction(
  id: string
): Promise<ActionResult<PostItem | null>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbPostRecord>();

  if (error || !data) {
    return {
      success: false,
      message: "Không tìm thấy bài viết: " + (error?.message || "Không tồn tại"),
      data: null,
    };
  }

  return {
    success: true,
    message: "Tải bài viết thành công.",
    data: mapDbToPostItem(data),
  };
}

/**
 * Tạo bài viết mới
 */
export async function createPostAction(
  input: PostInput
): Promise<ActionResult<PostItem>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  // 1. Validate Tiêu đề
  const title = (input.title || "").trim();
  if (!title || title.length < 2 || title.length > 255) {
    return {
      success: false,
      message: "Tiêu đề bài viết là bắt buộc và phải từ 2 đến 255 ký tự.",
    };
  }

  // 2. Validate Slug
  let slug = (input.slug || "").trim().toLowerCase();
  if (!slug) {
    slug = slugify(title);
  }
  if (!isValidSlug(slug)) {
    return {
      success: false,
      message: "Slug không hợp lệ. Chỉ chấp nhận chữ thường không dấu, số và gạch nối.",
    };
  }

  // 3. Validate Category
  if (!["medical", "transport", "company"].includes(input.category)) {
    return {
      success: false,
      message: "Danh mục bài viết không hợp lệ.",
    };
  }

  const supabase = await createClient();

  // Kiểm tra trùng slug
  const { data: existingSlug } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      message: `Slug '${slug}' đã được sử dụng bởi bài viết khác. Vui lòng chọn slug khác.`,
    };
  }

  // 4. Sanitize nội dung HTML ở phía Server
  const cleanContent = sanitizeHtml(input.content || "");

  // 5. Xác định thời điểm published_at
  let publishedAt = input.publishedAt?.trim();
  if (!publishedAt) {
    publishedAt = new Date().toISOString();
  } else {
    // Đảm bảo định dạng ISO hợp lệ
    const dateObj = new Date(publishedAt);
    publishedAt = isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();
  }

  const newRecord = {
    title,
    slug,
    category: input.category,
    excerpt: (input.excerpt || "").trim().substring(0, 500) || null,
    content: cleanContent,
    cover_image_url: (input.coverImageUrl || "").trim() || null,
    author: (input.author || "CAREVIA").trim(),
    status: input.status === "published" ? "published" : "draft",
    published_at: publishedAt,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(newRecord)
    .select("*")
    .single<DbPostRecord>();

  if (error || !data) {
    console.error("[PostsAction] Error creating post:", error);
    return {
      success: false,
      message: "Không thể tạo bài viết: " + (error?.message || "Lỗi không xác định"),
    };
  }

  triggerPostsRevalidation(slug);

  return {
    success: true,
    message: input.status === "published" ? "Đã đăng bài viết thành công!" : "Đã lưu bản nháp bài viết!",
    data: mapDbToPostItem(data),
  };
}

/**
 * Cập nhật bài viết
 */
export async function updatePostAction(
  id: string,
  input: PostInput
): Promise<ActionResult<PostItem>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: oldRecord, error: fetchErr } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbPostRecord>();

  if (fetchErr || !oldRecord) {
    return {
      success: false,
      message: "Bài viết cần chỉnh sửa không tồn tại.",
    };
  }

  const title = (input.title || "").trim();
  if (!title || title.length < 2 || title.length > 255) {
    return {
      success: false,
      message: "Tiêu đề bài viết là bắt buộc và phải từ 2 đến 255 ký tự.",
    };
  }

  let slug = (input.slug || "").trim().toLowerCase();
  if (!slug) {
    slug = slugify(title);
  }
  if (!isValidSlug(slug)) {
    return {
      success: false,
      message: "Slug không hợp lệ.",
    };
  }

  if (slug !== oldRecord.slug) {
    const { data: existingSlug } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        message: `Slug '${slug}' đã được sử dụng bởi bài viết khác.`,
      };
    }
  }

  if (!["medical", "transport", "company"].includes(input.category)) {
    return {
      success: false,
      message: "Danh mục bài viết không hợp lệ.",
    };
  }

  const cleanContent = sanitizeHtml(input.content || "");

  let publishedAt = input.publishedAt?.trim();
  if (!publishedAt) {
    publishedAt = oldRecord.published_at || new Date().toISOString();
  } else {
    const dateObj = new Date(publishedAt);
    publishedAt = isNaN(dateObj.getTime()) ? oldRecord.published_at || new Date().toISOString() : dateObj.toISOString();
  }

  const updateData = {
    title,
    slug,
    category: input.category,
    excerpt: (input.excerpt || "").trim().substring(0, 500) || null,
    content: cleanContent,
    cover_image_url: (input.coverImageUrl || "").trim() || null,
    author: (input.author || "CAREVIA").trim(),
    status: input.status === "published" ? "published" : "draft",
    published_at: publishedAt,
  };

  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single<DbPostRecord>();

  if (error || !data) {
    console.error("[PostsAction] Error updating post:", error);
    return {
      success: false,
      message: "Không thể cập nhật bài viết: " + (error?.message || "Lỗi không xác định"),
    };
  }

  triggerPostsRevalidation(slug, oldRecord.slug);

  return {
    success: true,
    message: "Cập nhật bài viết thành công!",
    data: mapDbToPostItem(data),
  };
}

/**
 * Xóa vĩnh viễn bài viết
 */
export async function deletePostAction(id: string): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: record } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle<{ slug: string }>();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("[PostsAction] Error deleting post:", error);
    return {
      success: false,
      message: "Lỗi khi xóa bài viết: " + error.message,
    };
  }

  triggerPostsRevalidation(record?.slug);

  return {
    success: true,
    message: "Đã xóa bài viết thành công.",
  };
}

/**
 * Bật/Tắt nhanh trạng thái Đã đăng / Nháp
 */
export async function togglePostStatusAction(
  id: string,
  newStatus: PostStatus
): Promise<ActionResult<{ status: PostStatus }>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: record, error } = await supabase
    .from("posts")
    .update({ status: newStatus })
    .eq("id", id)
    .select("slug, status")
    .single<{ slug: string; status: PostStatus }>();

  if (error || !record) {
    return {
      success: false,
      message: "Không thể đổi trạng thái bài viết: " + (error?.message || "Lỗi"),
    };
  }

  triggerPostsRevalidation(record.slug);

  return {
    success: true,
    message: newStatus === "published" ? "Đã đăng bài viết." : "Đã chuyển về bản nháp.",
    data: { status: record.status },
  };
}

