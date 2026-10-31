-- ==============================================================================
-- CAREVIA CMS - SUPABASE DATABASE SCHEMA
-- Hỗ trợ chạy lại nhiều lần (idempotent) an toàn bằng IF NOT EXISTS và DROP POLICY IF EXISTS
-- ==============================================================================

-- 1. BẢNG SITE SETTINGS (Cấu hình website - ràng buộc duy nhất 1 dòng id = 1)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    logo_url TEXT,
    company_name TEXT NOT NULL DEFAULT 'CAREVIA',
    slogan TEXT,
    hotline TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    working_hours TEXT,
    zalo_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    footer_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BẢNG SERVICES (Dịch vụ Y tế & Vận tải)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    category TEXT NOT NULL CHECK (category IN ('medical', 'transport')),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    icon TEXT,
    features JSONB NOT NULL DEFAULT '[]'::JSONB,
    target_info TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    action_type TEXT NOT NULL DEFAULT 'none' CHECK (action_type IN ('zalo', 'detail_page', 'none')),
    zalo_url TEXT,
    price_images JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BẢNG POSTS (Tin tức & Bài viết)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('medical', 'transport', 'company')),
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    author TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BẢNG JOBS (Tin tuyển dụng)
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    badge TEXT,
    short_desc TEXT,
    description TEXT,
    requirements JSONB NOT NULL DEFAULT '[]'::JSONB,
    benefits JSONB NOT NULL DEFAULT '[]'::JSONB,
    work_type TEXT,
    location TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BẢNG CONTACT MESSAGES (Tin nhắn liên hệ từ khách hàng)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    phone TEXT NOT NULL CHECK (char_length(phone) >= 8 AND char_length(phone) <= 20),
    message TEXT NOT NULL CHECK (char_length(message) >= 5 AND char_length(message) <= 2000),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BẢNG ADMIN USERS (Phân quyền quản trị viên)
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- HÀM TIỆN ÍCH & TRIGGER
-- ==============================================================================

-- Hàm kiểm tra quyền admin: auth.uid() có trong admin_users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- BẬT ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Policies cho site_settings
DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;
CREATE POLICY "Allow public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admin update site_settings" ON public.site_settings;
CREATE POLICY "Allow admin update site_settings"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin insert site_settings" ON public.site_settings;
CREATE POLICY "Allow admin insert site_settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.is_admin());

-- 2. Policies cho services
DROP POLICY IF EXISTS "Allow read published services or admin all" ON public.services;
CREATE POLICY "Allow read published services or admin all"
  ON public.services FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Allow admin insert services" ON public.services;
CREATE POLICY "Allow admin insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admin update services" ON public.services;
CREATE POLICY "Allow admin update services"
  ON public.services FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin delete services" ON public.services;
CREATE POLICY "Allow admin delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- 3. Policies cho posts
DROP POLICY IF EXISTS "Allow read published posts or admin all" ON public.posts;
CREATE POLICY "Allow read published posts or admin all"
  ON public.posts FOR SELECT
  USING ((status = 'published' AND published_at <= NOW()) OR public.is_admin());

DROP POLICY IF EXISTS "Allow admin insert posts" ON public.posts;
CREATE POLICY "Allow admin insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admin update posts" ON public.posts;
CREATE POLICY "Allow admin update posts"
  ON public.posts FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin delete posts" ON public.posts;
CREATE POLICY "Allow admin delete posts"
  ON public.posts FOR DELETE
  USING (public.is_admin());

-- 4. Policies cho jobs
DROP POLICY IF EXISTS "Allow read open jobs or admin all" ON public.jobs;
CREATE POLICY "Allow read open jobs or admin all"
  ON public.jobs FOR SELECT
  USING (status = 'open' OR public.is_admin());

DROP POLICY IF EXISTS "Allow admin insert jobs" ON public.jobs;
CREATE POLICY "Allow admin insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admin update jobs" ON public.jobs;
CREATE POLICY "Allow admin update jobs"
  ON public.jobs FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin delete jobs" ON public.jobs;
CREATE POLICY "Allow admin delete jobs"
  ON public.jobs FOR DELETE
  USING (public.is_admin());

-- 5. Policies cho contact_messages
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin select contact_messages" ON public.contact_messages;
CREATE POLICY "Allow admin select contact_messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin update contact_messages" ON public.contact_messages;
CREATE POLICY "Allow admin update contact_messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin delete contact_messages" ON public.contact_messages;
CREATE POLICY "Allow admin delete contact_messages"
  ON public.contact_messages FOR DELETE
  USING (public.is_admin());

-- 6. Policies cho admin_users
DROP POLICY IF EXISTS "Allow users to view own admin status" ON public.admin_users;
CREATE POLICY "Allow users to view own admin status"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- SUPABASE STORAGE: BUCKET MEDIA & POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

DROP POLICY IF EXISTS "Allow public read media bucket" ON storage.objects;
CREATE POLICY "Allow public read media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow admin insert media bucket" ON storage.objects;
CREATE POLICY "Allow admin insert media bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Allow admin update media bucket" ON storage.objects;
CREATE POLICY "Allow admin update media bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Allow admin delete media bucket" ON storage.objects;
CREATE POLICY "Allow admin delete media bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());

-- ==============================================================================
-- HƯỚNG DẪN THÊM TÀI KHOẢN ADMIN ĐẦU TIÊN:
-- 1. Vào Supabase Dashboard -> Authentication -> Users -> Nhấn "Add user" -> "Create user".
-- 2. Điền Email & Password của bạn (ví dụ: admin@carevia.vn), bật "Auto Confirm User?".
-- 3. Copy `User UID` (chuỗi dạng UUID) của user vừa tạo.
-- 4. Chạy câu lệnh SQL bên dưới trong Supabase SQL Editor:
--
-- INSERT INTO public.admin_users (user_id)
-- VALUES ('<DÁN_USER_UID_VÀO_ĐÂY>')
-- ON CONFLICT (user_id) DO NOTHING;
-- ==============================================================================

