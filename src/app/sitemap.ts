import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { ITEMS } from "@/mocks/items";
import { CATEGORIES } from "@/mocks/categories";
import { COLLECTIONS } from "@/mocks/collections";
import { POLICY_SLUGS } from "@/mocks/content";

const STATIC_ROUTES = [
  "", "/menu", "/collections", "/reserve", "/about",
  "/gallery", "/visit", "/events", "/contact", "/faq",
  "/login", "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const items: MetadataRoute.Sitemap = ITEMS.map((i) => ({
    url: `${base}/item/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/menu/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const collections: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const policies: MetadataRoute.Sitemap = POLICY_SLUGS.map((slug) => ({
    url: `${base}/policies/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticEntries, ...items, ...categories, ...collections, ...policies];
}
