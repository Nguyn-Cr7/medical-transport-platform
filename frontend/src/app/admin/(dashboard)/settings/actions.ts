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
  } catch (revalErr) {
    console.warn("[SettingsAction] Revalidation note:", revalErr);
  }

  return {
    success: true,
    message: "Cập nhật cấu hình website thành công!",
  };
}

