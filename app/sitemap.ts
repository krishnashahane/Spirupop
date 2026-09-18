import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

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
    url: `${SITE_ORIGIN}${r}`,
    lastModified: now,
    changeFrequency: (r === "" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: r === "" ? 1 : 0.6,
  }));
}
