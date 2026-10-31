import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error("[Auth] Error getting current user:", err);
    return null;
  }
}

export async function verifyAdmin(): Promise<{ user: User | null; isAdmin: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, isAdmin: false };
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      return { user, isAdmin: false };
    }

    return { user, isAdmin: true };
  } catch (err) {
    console.error("[Auth] Error verifying admin:", err);
    return { user: null, isAdmin: false };
  }
}

export async function requireAdmin(): Promise<User> {
  const { user, isAdmin } = await verifyAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    // Authenticated user exists but does NOT have admin role
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}

