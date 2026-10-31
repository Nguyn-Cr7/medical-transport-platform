import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabase/client";
import { COMPANY_INFO } from "@/data/companyInfo";
import { MEDICAL_SERVICES, type MedicalServiceItem } from "@/data/medicalServices";
import { TRANSPORT_SERVICES, type TransportServiceItem } from "@/data/transportServices";
import { NEWS_ARTICLES, type NewsArticle } from "@/data/news";
import { CAREER_GROUPS, type CareerGroup } from "@/data/careers";
import type {
  SiteSettings,
  ServiceItem,
  ServiceCategory,
  ServiceActionType,
  PriceImage,
  PostItem,
  PostCategory,
  PostStatus,
  JobItem,
  JobStatus,
} from "@/types/content";

function getAnonSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Database Row Types (snake_case)
interface DbSettingsRow {
  id: number;
  logo_url: string | null;
  company_name: string | null;
  slogan: string | null;
  hotline: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  working_hours: string | null;
  zalo_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  footer_text: string | null;
}

interface DbServiceRow {
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
}

interface DbPostRow {
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
}

interface DbJobRow {
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
}

// ============================================================================
// FALLBACK DATA MAPPERS
// ============================================================================

export function getFallbackSettings(): SiteSettings {
  return {
    id: 1,
    companyName: COMPANY_INFO.name,
    slogan: COMPANY_INFO.slogan,
    hotline: COMPANY_INFO.hotline || "1900 888 999",
    hotlineDisplay: COMPANY_INFO.hotlineDisplay || "1900 888 999",
    phone: COMPANY_INFO.phone || "0988 123 456",
    email: COMPANY_INFO.email,
    address: COMPANY_INFO.address,
    workingHours: COMPANY_INFO.workingHours,
    zaloUrl: "https://zalo.me/0986767960",
    facebookUrl: COMPANY_INFO.facebookUrl,
    youtubeUrl: COMPANY_INFO.youtubeUrl,
    footerText:
      "CAREVIA - Hệ sinh thái kết nối dịch vụ Y tế tại nhà & Vận chuyển y tế hàng đầu. Phục vụ 24/7 tận tâm, an toàn, chu đáo.",
  };
}

function mapMedicalFallback(item: MedicalServiceItem, index: number): ServiceItem {
  return {
    id: item.id,
    category: "medical",
    slug: item.slug,
    title: item.title,
    shortDesc: item.shortDesc,
    fullDesc: item.fullDesc,
    icon: item.icon,
    features: item.features || [],
    targetInfo: item.targetPatients,
    sortOrder: index + 1,
    isPublished: true,
    actionType: item.slug === "xet-nghiem-tuyen-truoc" ? "detail_page" : "zalo",
    zaloUrl: null,
    priceImages: [],
    popular: item.popular,
  };
}

function mapTransportFallback(item: TransportServiceItem, index: number): ServiceItem {
  return {
    id: item.id,
    category: "transport",
    slug: item.slug,
    title: item.title,
    shortDesc: item.shortDesc,
    fullDesc: item.fullDesc,
    icon: item.icon,
    features: item.features || [],
    targetInfo: item.suitableFor,
    sortOrder: index + 10,
    isPublished: true,
    actionType: "none",
    zaloUrl: null,
    priceImages: [],
    popular: item.popular,
  };
}

export function getFallbackServices(category?: ServiceCategory): ServiceItem[] {
  const medical = MEDICAL_SERVICES.map(mapMedicalFallback);
  const transport = TRANSPORT_SERVICES.map(mapTransportFallback);

  if (category === "medical") return medical;
  if (category === "transport") return transport;
  return [...medical, ...transport];
}

export function getFallbackPosts(category?: string): PostItem[] {
  const posts: PostItem[] = NEWS_ARTICLES.map((article: NewsArticle) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    categoryLabel: article.categoryLabel,
    excerpt: article.excerpt,
    content: article.content,
    coverImageUrl: null,
    author: article.author,
    status: "published",
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    featured: article.featured,
  }));

  if (category) {
    return posts.filter((p) => p.category === category);
  }
  return posts;
}

export function getFallbackJobs(): JobItem[] {
  return CAREER_GROUPS.map((job: CareerGroup, index: number) => ({
    id: job.id,
    slug: job.id,
    title: job.title,
    badge: job.badge,
    shortDesc: job.shortDesc,
    description: job.description,
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    educationRequirement: job.educationRequirement,
    workType: job.workType,
    location: job.location,
    status: "open",
    sortOrder: index + 1,
    subDivisions: job.subDivisions,
  }));
}

// ============================================================================
// SUPABASE DATA FETCHERS (UNCACHED IMPLEMENTATIONS)
// ============================================================================

async function fetchSettingsUncached(): Promise<SiteSettings> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    console.warn("[Content] Supabase not configured. Using fallback settings.");
    return getFallbackSettings();
  }

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle<DbSettingsRow>();

    if (error || !data) {
      console.warn("[Content] Failed to fetch settings from Supabase, using fallback:", error?.message);
      return getFallbackSettings();
    }

    return {
      id: data.id,
      logoUrl: data.logo_url,
      companyName: data.company_name || COMPANY_INFO.name,
      slogan: data.slogan || COMPANY_INFO.slogan,
      hotline: data.hotline || "1900 888 999",
      hotlineDisplay: data.hotline || "1900 888 999",
      phone: data.phone || "0988 123 456",
      email: data.email || COMPANY_INFO.email,
      address: data.address || COMPANY_INFO.address,
      workingHours: data.working_hours || COMPANY_INFO.workingHours,
      zaloUrl: data.zalo_url || "https://zalo.me/0986767960",
      facebookUrl: data.facebook_url,
      youtubeUrl: data.youtube_url,
      footerText: data.footer_text || getFallbackSettings().footerText,
    };
  } catch (err) {
    console.warn("[Content] Error fetching settings:", err);
    return getFallbackSettings();
  }
}

async function fetchServicesUncached(category?: ServiceCategory): Promise<ServiceItem[]> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    console.warn("[Content] Supabase not configured. Using fallback services.");
    return getFallbackServices(category);
  }

  try {
    let query = supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.returns<DbServiceRow[]>();
    if (error || !data || data.length === 0) {
      console.warn("[Content] No services from Supabase or error, using fallback:", error?.message);
      return getFallbackServices(category);
    }

    return data.map((d: DbServiceRow) => ({
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
    }));
  } catch (err) {
    console.warn("[Content] Error fetching services:", err);
    return getFallbackServices(category);
  }
}

async function fetchServiceBySlugUncached(slug: string): Promise<ServiceItem | null> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    const list = getFallbackServices();
    return list.find((s) => s.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle<DbServiceRow>();

    if (error || !data) {
      const fallbackList = getFallbackServices();
      const fallback = fallbackList.find((s) => s.slug === slug);
      if (fallback) {
        console.warn(`[Content] Service '${slug}' not in Supabase, using fallback.`);
        return fallback;
      }
      return null;
    }

    return {
      id: data.id,
      category: data.category,
      slug: data.slug,
      title: data.title,
      shortDesc: data.short_desc || "",
      fullDesc: data.full_desc || "",
      icon: data.icon || "Activity",
      features: Array.isArray(data.features) ? data.features : [],
      targetInfo: data.target_info || "",
      sortOrder: data.sort_order ?? 0,
      isPublished: data.is_published ?? true,
      actionType: data.action_type || "none",
      zaloUrl: data.zalo_url || null,
      priceImages: Array.isArray(data.price_images) ? data.price_images : [],
    };
  } catch (err) {
    console.warn(`[Content] Error fetching service '${slug}':`, err);
    const fallbackList = getFallbackServices();
    return fallbackList.find((s) => s.slug === slug) || null;
  }
}

async function fetchPostsUncached(category?: string): Promise<PostItem[]> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    console.warn("[Content] Supabase not configured. Using fallback posts.");
    return getFallbackPosts(category);
  }

  try {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.returns<DbPostRow[]>();
    if (error || !data || data.length === 0) {
      console.warn("[Content] No posts from Supabase or error, using fallback:", error?.message);
      return getFallbackPosts(category);
    }

    const categoryLabels: Record<string, string> = {
      medical: "Y Tế Tại Nhà",
      transport: "Vận Tải Y Tế",
      company: "Tin Doanh Nghiệp",
    };

    return data.map((d: DbPostRow) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      category: d.category,
      categoryLabel: categoryLabels[d.category] || "Tin Tức",
      excerpt: d.excerpt || "",
      content: d.content || "",
      coverImageUrl: d.cover_image_url || null,
      author: d.author || "CAREVIA",
      status: d.status,
      publishedAt: d.published_at ? d.published_at.substring(0, 10) : "",
    }));
  } catch (err) {
    console.warn("[Content] Error fetching posts:", err);
    return getFallbackPosts(category);
  }
}

async function fetchPostBySlugUncached(slug: string): Promise<PostItem | null> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    const list = getFallbackPosts();
    return list.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle<DbPostRow>();

    if (error || !data) {
      const fallbackList = getFallbackPosts();
      const fallback = fallbackList.find((p) => p.slug === slug);
      if (fallback) {
        console.warn(`[Content] Post '${slug}' not in Supabase, using fallback.`);
        return fallback;
      }
      return null;
    }

    const categoryLabels: Record<string, string> = {
      medical: "Y Tế Tại Nhà",
      transport: "Vận Tải Y Tế",
      company: "Tin Doanh Nghiệp",
    };

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      categoryLabel: categoryLabels[data.category] || "Tin Tức",
      excerpt: data.excerpt || "",
      content: data.content || "",
      coverImageUrl: data.cover_image_url || null,
      author: data.author || "CAREVIA",
      status: data.status,
      publishedAt: data.published_at ? data.published_at.substring(0, 10) : "",
    };
  } catch (err) {
    console.warn(`[Content] Error fetching post '${slug}':`, err);
    const fallbackList = getFallbackPosts();
    return fallbackList.find((p) => p.slug === slug) || null;
  }
}

async function fetchJobsUncached(): Promise<JobItem[]> {
  const supabase = getAnonSupabase();
  if (!supabase) {
    console.warn("[Content] Supabase not configured. Using fallback jobs.");
    return getFallbackJobs();
  }

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "open")
      .order("sort_order", { ascending: true })
      .returns<DbJobRow[]>();

    if (error || !data || data.length === 0) {
      console.warn("[Content] No jobs from Supabase or error, using fallback:", error?.message);
      return getFallbackJobs();
    }

    return data.map((d: DbJobRow) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      badge: d.badge || "Tuyển Dụng",
      shortDesc: d.short_desc || "",
      description: d.description || "",
      requirements: Array.isArray(d.requirements) ? d.requirements : [],
      benefits: Array.isArray(d.benefits) ? d.benefits : [],
      workType: d.work_type || "",
      location: d.location || "",
      status: d.status,
      sortOrder: d.sort_order ?? 0,
    }));
  } catch (err) {
    console.warn("[Content] Error fetching jobs:", err);
    return getFallbackJobs();
  }
}

// ============================================================================
// CACHED PUBLIC EXPORTS (ISR 60s & On-demand tags)
// ============================================================================

export const getSettings = unstable_cache(
  fetchSettingsUncached,
  ["site_settings"],
  { revalidate: 60, tags: ["settings"] }
);

export const getServices = (category?: ServiceCategory) => {
  const cachedFn = unstable_cache(
    () => fetchServicesUncached(category),
    ["services", category || "all"],
    { revalidate: 60, tags: ["services", ...(category ? [`services:${category}`] : [])] }
  );
  return cachedFn();
};

export const getService = (slug: string) => {
  const cachedFn = unstable_cache(
    () => fetchServiceBySlugUncached(slug),
    ["service", slug],
    { revalidate: 60, tags: ["services", `service:${slug}`] }
  );
  return cachedFn();
};

export const getPosts = (category?: string) => {
  const cachedFn = unstable_cache(
    () => fetchPostsUncached(category),
    ["posts", category || "all"],
    { revalidate: 60, tags: ["posts", ...(category ? [`posts:${category}`] : [])] }
  );
  return cachedFn();
};

export const getPost = (slug: string) => {
  const cachedFn = unstable_cache(
    () => fetchPostBySlugUncached(slug),
    ["post", slug],
    { revalidate: 60, tags: ["posts", `post:${slug}`] }
  );
  return cachedFn();
};

export const getJobs = unstable_cache(
  fetchJobsUncached,
  ["jobs"],
  { revalidate: 60, tags: ["jobs"] }
);
