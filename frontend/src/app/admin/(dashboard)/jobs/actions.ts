"use server";

import { verifyAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath, updateTag } from "next/cache";
import { isValidSlug, slugify } from "@/lib/slugify";
import type { JobItem, JobStatus } from "@/types/content";

export interface JobInput {
  title: string;
  slug: string;
  badge?: string;
  shortDesc?: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  workType?: string;
  location?: string;
  status: JobStatus;
  sortOrder?: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface DbJobRecord {
  id: string;
  slug: string;
  title: string;
  badge: string | null;
  short_desc: string | null;
  description: string | null;
  requirements: string[] | null;
  benefits: string[] | null;
  work_type: string | null;
  location: string | null;
  status: JobStatus;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

function mapDbToJobItem(d: DbJobRecord): JobItem {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    badge: d.badge || "Tuyển Dụng",
    shortDesc: d.short_desc || "",
    description: d.description || "",
    requirements: Array.isArray(d.requirements) ? d.requirements : [],
    benefits: Array.isArray(d.benefits) ? d.benefits : [],
    workType: d.work_type || "Toàn thời gian",
    location: d.location || "TP. Hồ Chí Minh",
    status: d.status,
    sortOrder: d.sort_order ?? 0,
  };
}

function triggerJobsRevalidation() {
  try {
    updateTag("jobs");
    revalidateTag("jobs", "max");
    revalidatePath("/careers");
    revalidatePath("/");
  } catch (err) {
    console.warn("[JobsAction] Revalidation note:", err);
  }
}

/**
 * Lấy danh sách toàn bộ tin tuyển dụng dành cho Admin (Cả Đang mở & Đã đóng)
 */
export async function getAdminJobsAction(): Promise<ActionResult<JobItem[]>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[JobsAction] Error fetching admin jobs:", error);
    return {
      success: false,
      message: "Không thể tải danh sách tuyển dụng: " + error.message,
    };
  }

  const items = (data as DbJobRecord[]).map(mapDbToJobItem);
  return {
    success: true,
    message: "Tải danh sách tuyển dụng thành công.",
    data: items,
  };
}

/**
 * Lấy chi tiết tin tuyển dụng theo ID
 */
export async function getAdminJobByIdAction(
  id: string
): Promise<ActionResult<JobItem | null>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbJobRecord>();

  if (error || !data) {
    return {
      success: false,
      message: "Không tìm thấy tin tuyển dụng: " + (error?.message || "Không tồn tại"),
      data: null,
    };
  }

  return {
    success: true,
    message: "Tải tin tuyển dụng thành công.",
    data: mapDbToJobItem(data),
  };
}

/**
 * Tạo tin tuyển dụng mới
 */
export async function createJobAction(
  input: JobInput
): Promise<ActionResult<JobItem>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const title = (input.title || "").trim();
  if (!title || title.length < 2 || title.length > 255) {
    return {
      success: false,
      message: "Tiêu đề vị trí tuyển dụng phải từ 2 đến 255 ký tự.",
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

  const supabase = await createClient();

  const { data: existingSlug } = await supabase
    .from("jobs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      message: `Slug '${slug}' đã được sử dụng bởi vị trí khác.`,
    };
  }

  const cleanReqs = (input.requirements || []).map((r) => r.trim()).filter(Boolean);
  const cleanBens = (input.benefits || []).map((b) => b.trim()).filter(Boolean);

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined || sortOrder === null) {
    const { data: lastOrder } = await supabase
      .from("jobs")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = (lastOrder?.sort_order ?? 0) + 1;
  }

  const newRecord = {
    title,
    slug,
    badge: (input.badge || "").trim() || "Tuyển Dụng",
    short_desc: (input.shortDesc || "").trim() || null,
    description: (input.description || "").trim() || null,
    requirements: cleanReqs,
    benefits: cleanBens,
    work_type: (input.workType || "Toàn thời gian").trim(),
    location: (input.location || "TP. Hồ Chí Minh").trim(),
    status: input.status === "closed" ? "closed" : "open",
    sort_order: sortOrder,
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(newRecord)
    .select("*")
    .single<DbJobRecord>();

  if (error || !data) {
    console.error("[JobsAction] Error creating job:", error);
    return {
      success: false,
      message: "Không thể tạo tin tuyển dụng: " + (error?.message || "Lỗi không xác định"),
    };
  }

  triggerJobsRevalidation();

  return {
    success: true,
    message: "Tạo tin tuyển dụng mới thành công!",
    data: mapDbToJobItem(data),
  };
}

/**
 * Cập nhật tin tuyển dụng
 */
export async function updateJobAction(
  id: string,
  input: JobInput
): Promise<ActionResult<JobItem>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: oldRecord, error: fetchErr } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbJobRecord>();

  if (fetchErr || !oldRecord) {
    return {
      success: false,
      message: "Tin tuyển dụng cần chỉnh sửa không tồn tại.",
    };
  }

  const title = (input.title || "").trim();
  if (!title || title.length < 2 || title.length > 255) {
    return {
      success: false,
      message: "Tiêu đề vị trí tuyển dụng phải từ 2 đến 255 ký tự.",
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
      .from("jobs")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        message: `Slug '${slug}' đã được sử dụng bởi vị trí khác.`,
      };
    }
  }

  const cleanReqs = (input.requirements || []).map((r) => r.trim()).filter(Boolean);
  const cleanBens = (input.benefits || []).map((b) => b.trim()).filter(Boolean);

  const updateData = {
    title,
    slug,
    badge: (input.badge || "").trim() || "Tuyển Dụng",
    short_desc: (input.shortDesc || "").trim() || null,
    description: (input.description || "").trim() || null,
    requirements: cleanReqs,
    benefits: cleanBens,
    work_type: (input.workType || "Toàn thời gian").trim(),
    location: (input.location || "TP. Hồ Chí Minh").trim(),
    status: input.status === "closed" ? "closed" : "open",
    sort_order: input.sortOrder ?? oldRecord.sort_order ?? 0,
  };

  const { data, error } = await supabase
    .from("jobs")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single<DbJobRecord>();

  if (error || !data) {
    console.error("[JobsAction] Error updating job:", error);
    return {
      success: false,
      message: "Không thể cập nhật tin tuyển dụng: " + (error?.message || "Lỗi"),
    };
  }

  triggerJobsRevalidation();

  return {
    success: true,
    message: "Cập nhật tin tuyển dụng thành công!",
    data: mapDbToJobItem(data),
  };
}

/**
 * Xóa vĩnh viễn tin tuyển dụng
 */
export async function deleteJobAction(id: string): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    console.error("[JobsAction] Error deleting job:", error);
    return {
      success: false,
      message: "Lỗi khi xóa tin tuyển dụng: " + error.message,
    };
  }

  triggerJobsRevalidation();

  return {
    success: true,
    message: "Đã xóa tin tuyển dụng thành công.",
  };
}

/**
 * Bật/Tắt nhanh trạng thái Đang mở / Đã đóng
 */
export async function toggleJobStatusAction(
  id: string,
  newStatus: JobStatus
): Promise<ActionResult<{ status: JobStatus }>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data: record, error } = await supabase
    .from("jobs")
    .update({ status: newStatus })
    .eq("id", id)
    .select("status")
    .single<{ status: JobStatus }>();

  if (error || !record) {
    return {
      success: false,
      message: "Không thể cập nhật trạng thái: " + (error?.message || "Lỗi"),
    };
  }

  triggerJobsRevalidation();

  return {
    success: true,
    message: newStatus === "open" ? "Đã mở lại tin tuyển dụng." : "Đã đóng tin tuyển dụng.",
    data: { status: record.status },
  };
}

/**
 * Hoán đổi thứ tự hiển thị của 2 tin tuyển dụng
 */
export async function swapJobOrderAction(
  id1: string,
  order1: number,
  id2: string,
  order2: number
): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const update1 = supabase.from("jobs").update({ sort_order: order2 }).eq("id", id1);
  const update2 = supabase.from("jobs").update({ sort_order: order1 }).eq("id", id2);

  const [res1, res2] = await Promise.all([update1, update2]);

  if (res1.error || res2.error) {
    return {
      success: false,
      message: "Lỗi cập nhật thứ tự hiển thị.",
    };
  }

  triggerJobsRevalidation();

  return {
    success: true,
    message: "Đã cập nhật thứ tự hiển thị.",
  };
}

