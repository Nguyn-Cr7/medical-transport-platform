export type ServiceCategory = "medical" | "transport";
export type ServiceActionType = "zalo" | "detail_page" | "none";

export interface PriceImage {
  url: string;
  label?: string;
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  features: string[];
  targetInfo: string;
  sortOrder: number;
  isPublished: boolean;
  actionType: ServiceActionType;
  zaloUrl?: string | null;
  priceImages: PriceImage[];
  popular?: boolean;
}

export type PostCategory = "medical" | "transport" | "company";
export type PostStatus = "draft" | "published";

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  categoryLabel?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  author: string;
  status: PostStatus;
  publishedAt: string;
  readTime?: string;
  featured?: boolean;
}

export type JobStatus = "open" | "closed";

export interface JobItem {
  id: string;
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  description: string;
  requirements: string[];
  benefits: string[];
  educationRequirement?: string;
  workType: string;
  location: string;
  status: JobStatus;
  sortOrder: number;
  subDivisions?: string[];
}

export interface SiteSettings {
  id?: number;
  logoUrl?: string | null;
  companyName: string;
  slogan: string;
  hotline: string;
  hotlineDisplay?: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  zaloUrl: string;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  footerText?: string | null;
}

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

