"use server";

import { verifyAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath, updateTag } from "next/cache";
import type { SiteSettings } from "@/types/content";

export async function updateSiteSettingsAction(settings: Partial<SiteSettings>) {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  if (!settings.companyName || settings.companyName.trim().length < 2) {
    return { success: false, message: "Tên công ty không được để trống." };
  }

  // Validate heroIntervalSeconds
  let heroInterval = 5;
  if (typeof settings.heroIntervalSeconds === "number") {
    if (settings.heroIntervalSeconds < 2 || settings.heroIntervalSeconds > 30) {
      return {
        success: false,
        message: "Thời gian chuyển ảnh phải từ 2 đến 30 giây.",
      };
    }
    heroInterval = Math.round(settings.heroIntervalSeconds);
  }

  // Validate heroImages
  const rawHeroImages = settings.heroImages || [];
  if (!Array.isArray(rawHeroImages)) {
    return { success: false, message: "Dữ liệu ảnh trình chiếu không hợp lệ." };
  }

  // Filter out empty items
  const cleanedHeroImages = rawHeroImages
    .filter((img) => Boolean(img && typeof img.url === "string" && img.url.trim().length > 0))
    .map((img) => ({
      url: img.url.trim(),
      alt: typeof img.alt === "string" ? img.alt.trim() : "",
    }));

  if (cleanedHeroImages.length > 8) {
    return {
      success: false,
      message: "Tối đa 8 ảnh trình chiếu trang chủ.",
    };
  }

  for (const img of cleanedHeroImages) {
    if (
      !img.url.startsWith("http://") &&
      !img.url.startsWith("https://") &&
      !img.url.startsWith("/")
    ) {
      return {
        success: false,
        message: "Đường dẫn ảnh trình chiếu phải bắt đầu bằng http://, https:// hoặc đường dẫn hợp lệ.",
      };
    }
    if (img.alt && img.alt.length > 150) {
      return {
        success: false,
        message: `Mô tả ảnh "${img.alt.slice(0, 30)}..." vượt quá giới hạn 150 ký tự.`,
      };
    }
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      logo_url: settings.logoUrl || null,
      company_name: settings.companyName.trim(),
      slogan: settings.slogan || "",
      hotline: settings.hotline || "",
      phone: settings.phone || "",
      email: settings.email || "",
      address: settings.address || "",
      working_hours: settings.workingHours || "",
      zalo_url: settings.zaloUrl || "",
      facebook_url: settings.facebookUrl || null,
      youtube_url: settings.youtubeUrl || null,
      footer_text: settings.footerText || "",
      hero_images: cleanedHeroImages,
      hero_interval_seconds: heroInterval,
    })
    .eq("id", 1);

  if (error) {
    console.error("[SettingsAction] Error updating settings:", error);
    return {
      success: false,
      message: "Lỗi cập nhật cấu hình: " + error.message,
    };
  }

  // Next.js 16 On-demand ISR Revalidation
  try {
    updateTag("settings");
    revalidateTag("settings", "max");
    revalidatePath("/", "layout");
    revalidatePath("/", "page");
  } catch (revalErr) {
    console.warn("[SettingsAction] Revalidation note:", revalErr);
  }

  return {
    success: true,
    message: "Cập nhật cấu hình website thành công!",
  };
}

