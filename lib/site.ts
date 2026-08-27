// Single source of truth for the public site identity, used by metadata,
// robots.txt, sitemap.xml, and JSON-LD so they never drift apart.
//
// NEXT_PUBLIC_SITE_URL must be set to the production origin (no trailing
// slash) once deployed, e.g. "https://exmengantar.com" — canonical URLs,
// the sitemap, and OG tags all derive from it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "Ex-Mengantar IT Team";
