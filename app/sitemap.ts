import type { MetadataRoute } from "next";

const BASE = "https://spirupop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    "",
    "/science",
    "/story",
    "/reviews",
    "/journal",
    "/faq",
    "/contact",
    "/policies/privacy",
    "/policies/terms",
    "/policies/shipping",
    "/policies/refund",
    "/policies/disclaimer",
  ].map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: (r === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: r === "" ? 1 : 0.6,
  }));
}
