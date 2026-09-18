/**
 * Canonical site-origin helpers.
 *
 * SITE_ORIGIN is used only where an absolute public URL is genuinely required
 * (metadata, sitemap/robots, and server-to-server notification headers).
 * API calls from the browser remain same-origin and do not need this value.
 */
export function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    const isDevHttp =
      process.env.NODE_ENV !== "production" && url.protocol === "http:";

    if (url.protocol !== "https:" && !isDevHttp) return null;

    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export const SITE_ORIGIN =
  normalizeOrigin(process.env.SITE_ORIGIN) ?? "https://spirupop.com";
