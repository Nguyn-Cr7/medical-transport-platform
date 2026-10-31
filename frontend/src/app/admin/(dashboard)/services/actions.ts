"use server";

import { verifyAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath, updateTag } from "next/cache";
import { isValidSlug, slugify } from "@/lib/slugify";
import type {
  ServiceItem,
  ServiceCategory,
  ServiceActionType,
  PriceImage,
} from "@/types/content";

export interface ServiceInput {
  title: string;
  slug: string;
  shortDesc?: string;
  fullDesc?: string;
  icon?: string;
  features?: string[];
  targetInfo?: string;
  sortOrder?: number;
  isPublished?: boolean;
  actionType?: ServiceActionType;
  zaloUrl?: string;
  priceImages?: PriceImage[];
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface DbServiceRecord {
  id: string;
  category: ServiceCategory;
  slug: string;
  title: string;
  short_desc: string | null;
  full_desc: string | null;
  icon: string | null;
  features: string[] | null;
  target_info: string | null;
  sort_order: number | null;
  is_published: boolean | null;
  action_type: ServiceActionType | null;
  zalo_url: string | null;
  price_images: PriceImage[] | null;
  created_at: string;
  updated_at: string;
}

function mapDbToServiceItem(d: DbServiceRecord): ServiceItem {
  return {
    id: d.id,
    category: d.category,
    slug: d.slug,
    title: d.title,
    shortDesc: d.short_desc || "",
    fullDesc: d.full_desc || "",
    icon: d.icon || "Activity",
    features: Array.isArray(d.features) ? d.features : [],
    targetInfo: d.target_info || "",
    sortOrder: d.sort_order ?? 0,
    isPublished: d.is_published ?? true,
    actionType: d.action_type || "none",
    zaloUrl: d.zalo_url || null,
    priceImages: Array.isArray(d.price_images) ? d.price_images : [],
  };
}

function validateAndCleanPriceImages(rawImages: unknown): {
  valid: boolean;
  message?: string;
  data: PriceImage[];
} {
  if (!Array.isArray(rawImages)) {
    return { valid: true, data: [] };
  }

  const cleaned: PriceImage[] = [];

  for (const item of rawImages) {
    if (!item || typeof item !== "object") continue;
    const url = typeof (item as { url?: unknown }).url === "string" ? (item as { url: string }).url.trim() : "";
    if (!url) continue;

    if (!url.startsWith("https://") && !url.startsWith("http://") && !url.startsWith("/")) {
      return {
        valid: false,
        message: "URL hình ảnh bảng giá không hợp lệ. Phải bắt đầu bằng 'https://' hoặc đường dẫn tương đối.",
        data: [],
      };
    }

    const rawLabel = typeof (item as { label?: unknown }).label === "string" ? (item as { label: string }).label.trim() : "";
    const label = rawLabel.substring(0, 100) || "Bảng giá";

    const rawGroup = typeof (item as { group?: unknown }).group === "string" ? (item as { group: string }).group.trim() : "";
    const group = rawGroup ? rawGroup.substring(0, 100) : undefined;

    cleaned.push({
      url,
      label,
      ...(group ? { group } : {}),
    });
  }

  if (cleaned.length > 40) {
    return {
      valid: false,
      message: "Số lượng ảnh bảng giá vượt quá giới hạn tối đa cho phép (tối đa 20 cặp / 40 ảnh).",
      data: [],
    };
  }

  return { valid: true, data: cleaned };
}

/**
 * Revalidate tất cả cache liên quan đến services
 */
function triggerServicesRevalidation(
  slug?: string,
  oldSlug?: string,
  category?: ServiceCategory
) {
  try {
    updateTag("services");
    revalidateTag("services", "max");
    if (category) {
      updateTag(`services:${category}`);
      revalidateTag(`services:${category}`, "max");
    }
    revalidatePath("/", "layout"); // Revalidate Footer
    revalidatePath("/medical");
    revalidatePath("/transport");

    if (slug) {
      revalidatePath(`/medical/${slug}`);
    }
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/medical/${oldSlug}`);
    }
  } catch (err) {
    console.warn("[ServicesAction] Revalidation note:", err);
  }
}

/**
 * Lấy toàn bộ danh sách dịch vụ theo category dành cho Admin (bao gồm cả Nháp)
 */
export async function getAdminServicesAction(
  category: ServiceCategory
): Promise<ActionResult<ServiceItem[]>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ServicesAction] Error fetching admin services:", error);
    return {
      success: false,
      message: "Không thể tải danh sách dịch vụ: " + error.message,
    };
  }

  const items = (data as DbServiceRecord[]).map(mapDbToServiceItem);
  return {
    success: true,
    message: "Tải danh sách dịch vụ thành công.",
    data: items,
  };
}

/**
 * Lấy thông tin chi tiết một dịch vụ theo ID
 */
export async function getAdminServiceByIdAction(
  id: string
): Promise<ActionResult<ServiceItem | null>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbServiceRecord>();

  if (error) {
    console.error("[ServicesAction] Error fetching service by id:", error);
    return {
      success: false,
      message: "Không tìm thấy dịch vụ: " + error.message,
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Dịch vụ không tồn tại trong hệ thống.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Tải thông tin dịch vụ thành công.",
    data: mapDbToServiceItem(data),
  };
}

/**
 * Tạo dịch vụ mới
 */
export async function createServiceAction(
  input: ServiceInput,
  category: ServiceCategory
): Promise<ActionResult<ServiceItem>> {
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
      message: "Tiêu đề dịch vụ là bắt buộc và phải từ 2 đến 255 ký tự.",
    };
  }

  // 2. Validate & Chuẩn hóa Slug
  let slug = (input.slug || "").trim().toLowerCase();
  if (!slug) {
    slug = slugify(title);
  }
  if (!isValidSlug(slug)) {
    return {
      success: false,
      message:
        "Slug không hợp lệ. Chỉ chấp nhận chữ thường không dấu, số và gạch nối (ví dụ: cham-soc-tai-nha).",
    };
  }

  const supabase = await createClient();

  // Kiểm tra trùng slug
  const { data: existingSlug } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      message: `Slug '${slug}' đã được sử dụng bởi một dịch vụ khác. Vui lòng chọn slug khác.`,
    };
  }

  // 3. Chuẩn hóa category và các trường đặc thù
  let actionType: ServiceActionType = "none";
  let zaloUrl: string | null = null;
  let priceImages: PriceImage[] = [];

  if (category === "medical") {
    actionType = input.actionType || "none";
    if (!["zalo", "detail_page", "none"].includes(actionType)) {
      actionType = "none";
    }

    if (actionType === "zalo") {
      const zUrl = (input.zaloUrl || "").trim();
      if (zUrl) {
        if (!zUrl.startsWith("https://")) {
          return {
            success: false,
            message: "Link Zalo phải bắt đầu bằng 'https://' (ví dụ: https://zalo.me/0986767960).",
          };
        }
        zaloUrl = zUrl;
      }
    } else if (actionType === "detail_page") {
      const priceValidation = validateAndCleanPriceImages(input.priceImages);
      if (!priceValidation.valid) {
        return {
          success: false,
          message: priceValidation.message || "Danh sách ảnh bảng giá không hợp lệ.",
        };
      }
      priceImages = priceValidation.data;
    }
  } else {
    // Vận chuyển: luôn là 'none', không có Zalo riêng hay ảnh giá
    actionType = "none";
    zaloUrl = null;
    priceImages = [];
  }

  // 4. Chuẩn hóa features (bỏ dòng trống)
  const features = (input.features || [])
    .map((f) => (typeof f === "string" ? f.trim() : ""))
    .filter((f) => f.length > 0);

  // 5. Xác định sort_order nếu không cung cấp
  let sortOrder = input.sortOrder;
  if (sortOrder === undefined || sortOrder === null) {
    const { data: lastOrderData } = await supabase
      .from("services")
      .select("sort_order")
      .eq("category", category)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = (lastOrderData?.sort_order ?? 0) + 1;
  }

  const newRecord = {
    category,
    slug,
    title,
    short_desc: (input.shortDesc || "").trim() || null,
    full_desc: (input.fullDesc || "").trim() || null,
    icon: (input.icon || "").trim() || null,
    features,
    target_info: (input.targetInfo || "").trim() || null,
    sort_order: sortOrder,
    is_published: input.isPublished ?? true,
    action_type: actionType,
    zalo_url: zaloUrl,
    price_images: priceImages,
  };

  const { data, error } = await supabase
    .from("services")
    .insert(newRecord)
    .select("*")
    .single<DbServiceRecord>();

  if (error || !data) {
    console.error("[ServicesAction] Error creating service:", error);
    return {
      success: false,
      message: "Không thể tạo dịch vụ mới: " + (error?.message || "Lỗi không xác định"),
    };
  }

  triggerServicesRevalidation(slug, undefined, category);

  return {
    success: true,
    message: "Thêm dịch vụ mới thành công!",
    data: mapDbToServiceItem(data),
  };
}

/**
 * Cập nhật dịch vụ hiện có
 */
export async function updateServiceAction(
  id: string,
  input: ServiceInput,
  category: ServiceCategory
): Promise<ActionResult<ServiceItem>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  // Kiểm tra dịch vụ cũ để lấy oldSlug
  const { data: oldRecord, error: fetchErr } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle<DbServiceRecord>();

  if (fetchErr || !oldRecord) {
    return {
      success: false,
      message: "Dịch vụ cần chỉnh sửa không tồn tại.",
    };
  }

  // 1. Validate Tiêu đề
  const title = (input.title || "").trim();
  if (!title || title.length < 2 || title.length > 255) {
    return {
      success: false,
      message: "Tiêu đề dịch vụ là bắt buộc và phải từ 2 đến 255 ký tự.",
    };
  }

  // 2. Validate & Chuẩn hóa Slug
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

  // Nếu đổi slug, kiểm tra trùng với các dịch vụ khác
  if (slug !== oldRecord.slug) {
    const { data: existingSlug } = await supabase
      .from("services")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        message: `Slug '${slug}' đã được sử dụng bởi một dịch vụ khác. Vui lòng chọn slug khác.`,
      };
    }
  }

  // 3. Chuẩn hóa category và các trường đặc thù
  let actionType: ServiceActionType = "none";
  let zaloUrl: string | null = null;
  let priceImages: PriceImage[] = [];

  if (category === "medical") {
    actionType = input.actionType || "none";
    if (!["zalo", "detail_page", "none"].includes(actionType)) {
      actionType = "none";
    }

    if (actionType === "zalo") {
      const zUrl = (input.zaloUrl || "").trim();
      if (zUrl) {
        if (!zUrl.startsWith("https://")) {
          return {
            success: false,
            message: "Link Zalo phải bắt đầu bằng 'https://'.",
          };
        }
        zaloUrl = zUrl;
      }
    } else if (actionType === "detail_page") {
      const priceValidation = validateAndCleanPriceImages(input.priceImages);
      if (!priceValidation.valid) {
        return {
          success: false,
          message: priceValidation.message || "Danh sách ảnh bảng giá không hợp lệ.",
        };
      }
      priceImages = priceValidation.data;
    }
  } else {
    actionType = "none";
    zaloUrl = null;
    priceImages = [];
  }

  // 4. Chuẩn hóa features
  const features = (input.features || [])
    .map((f) => (typeof f === "string" ? f.trim() : ""))
    .filter((f) => f.length > 0);

  const updateData = {
    category,
    slug,
    title,
    short_desc: (input.shortDesc || "").trim() || null,
    full_desc: (input.fullDesc || "").trim() || null,
    icon: (input.icon || "").trim() || null,
    features,
    target_info: (input.targetInfo || "").trim() || null,
    sort_order: input.sortOrder ?? oldRecord.sort_order ?? 0,
    is_published: input.isPublished ?? oldRecord.is_published ?? true,
    action_type: actionType,
    zalo_url: zaloUrl,
    price_images: priceImages,
  };

  const { data, error } = await supabase
    .from("services")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single<DbServiceRecord>();

  if (error || !data) {
    console.error("[ServicesAction] Error updating service:", error);
    return {
      success: false,
      message: "Không thể cập nhật dịch vụ: " + (error?.message || "Lỗi không xác định"),
    };
  }

  triggerServicesRevalidation(slug, oldRecord.slug, category);

  return {
    success: true,
    message: "Cập nhật dịch vụ thành công!",
    data: mapDbToServiceItem(data),
  };
}

/**
 * Xóa vĩnh viễn dịch vụ
 */
export async function deleteServiceAction(
  id: string,
  category: ServiceCategory
): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: record } = await supabase
    .from("services")
    .select("slug")
    .eq("id", id)
    .maybeSingle<{ slug: string }>();

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("[ServicesAction] Error deleting service:", error);
    return {
      success: false,
      message: "Lỗi khi xóa dịch vụ: " + error.message,
    };
  }

  triggerServicesRevalidation(record?.slug, undefined, category);

  return {
    success: true,
    message: "Đã xóa dịch vụ thành công.",
  };
}

/**
 * Bật/Tắt trạng thái xuất bản trực tiếp từ danh sách
 */
export async function toggleServicePublishAction(
  id: string,
  isPublished: boolean,
  category: ServiceCategory
): Promise<ActionResult<{ isPublished: boolean }>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  const { data: record, error } = await supabase
    .from("services")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("slug, is_published")
    .single<{ slug: string; is_published: boolean }>();

  if (error || !record) {
    console.error("[ServicesAction] Error toggling publish status:", error);
    return {
      success: false,
      message: "Lỗi cập nhật trạng thái: " + (error?.message || "Không tìm thấy dữ liệu"),
    };
  }

  triggerServicesRevalidation(record.slug, undefined, category);

  return {
    success: true,
    message: isPublished ? "Đã xuất bản dịch vụ lên website." : "Đã chuyển dịch vụ về bản nháp.",
    data: { isPublished: record.is_published },
  };
}

/**
 * Hoán đổi thứ tự sort_order giữa 2 dịch vụ
 */
export async function swapServiceOrderAction(
  id1: string,
  order1: number,
  id2: string,
  order2: number,
  category: ServiceCategory
): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();

  // Hoán đổi: id1 nhận order2, id2 nhận order1
  const update1 = supabase.from("services").update({ sort_order: order2 }).eq("id", id1);
  const update2 = supabase.from("services").update({ sort_order: order1 }).eq("id", id2);

  const [res1, res2] = await Promise.all([update1, update2]);

  if (res1.error || res2.error) {
    console.error("[ServicesAction] Error swapping service orders:", res1.error || res2.error);
    return {
      success: false,
      message: "Lỗi khi cập nhật thứ tự dịch vụ.",
    };
  }

  triggerServicesRevalidation(undefined, undefined, category);

  return {
    success: true,
    message: "Đã cập nhật thứ tự hiển thị.",
  };
}
