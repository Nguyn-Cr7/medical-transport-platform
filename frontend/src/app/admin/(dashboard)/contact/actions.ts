"use server";

import { verifyAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/types/content";

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface DbContactRecord {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function mapDbToContactItem(d: DbContactRecord): ContactMessage {
  return {
    id: d.id,
    name: d.name,
    phone: d.phone,
    message: d.message,
    isRead: d.is_read,
    createdAt: d.created_at,
  };
}

/**
 * Lấy danh sách tin nhắn liên hệ (mới nhất trước, hỗ trợ lọc theo trạng thái đọc)
 */
export async function getAdminContactMessagesAction(filters?: {
  isRead?: boolean;
}): Promise<ActionResult<ContactMessage[]>> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.isRead !== undefined) {
    query = query.eq("is_read", filters.isRead);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[ContactAction] Error fetching contact messages:", error.message);
    return {
      success: false,
      message: "Không thể tải danh sách tin nhắn liên hệ: " + error.message,
    };
  }

  const items = (data as DbContactRecord[]).map(mapDbToContactItem);
  return {
    success: true,
    message: "Tải danh sách tin nhắn thành công.",
    data: items,
  };
}

/**
 * Lấy số lượng tin nhắn chưa đọc cho Sidebar và Dashboard
 */
export async function getUnreadContactCountAction(): Promise<number> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) return 0;

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Đánh dấu tin nhắn là đã đọc hoặc chưa đọc
 */
export async function markContactMessageReadAction(
  id: string,
  isRead: boolean
): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    console.error("[ContactAction] Error updating message read status:", error.message);
    return {
      success: false,
      message: "Lỗi cập nhật trạng thái tin nhắn.",
    };
  }

  return {
    success: true,
    message: isRead ? "Đã đánh dấu đã đọc." : "Đã đánh dấu chưa đọc.",
  };
}

/**
 * Đánh dấu tất cả tin nhắn là đã đọc
 */
export async function markAllContactMessagesReadAction(): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) {
    console.error("[ContactAction] Error marking all as read:", error.message);
    return {
      success: false,
      message: "Lỗi khi đánh dấu tất cả là đã đọc.",
    };
  }

  return {
    success: true,
    message: "Đã đánh dấu tất cả tin nhắn là đã đọc.",
  };
}

/**
 * Xóa một tin nhắn liên hệ
 */
export async function deleteContactMessageAction(id: string): Promise<ActionResult> {
  const { user, isAdmin } = await verifyAdmin();
  if (!user || !isAdmin) {
    return {
      success: false,
      message: "Bạn không có quyền quản trị để thực hiện thao tác này.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    console.error("[ContactAction] Error deleting contact message:", error.message);
    return {
      success: false,
      message: "Lỗi khi xóa tin nhắn liên hệ.",
    };
  }

  return {
    success: true,
    message: "Đã xóa tin nhắn liên hệ thành công.",
  };
}

