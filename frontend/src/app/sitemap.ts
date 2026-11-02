import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carevia.vn";
  const baseUrl = rawSiteUrl.replace(/\/+$/, "");

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/medical`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transport`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [posts, medicalServices] = await Promise.all([
      getPosts(),
      getServices("medical"),
    ]);

    // Published news articles
    const postRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Published medical detail pages
    const serviceRoutes: MetadataRoute.Sitemap = (medicalServices || [])
      .filter((service) => service.actionType === "detail_page" && service.isPublished)
      .map((service) => ({
        url: `${baseUrl}/medical/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...serviceRoutes, ...postRoutes];
  } catch (err) {
    console.warn("[Sitemap] Failed to fetch dynamic routes, using static routes:", err);
    return staticRoutes;
  }
}

