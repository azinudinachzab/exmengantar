import type { MetadataRoute } from "next";
import { getProfiles } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

// Regenerated on every request so it always mirrors what's in Redis —
// new and removed profiles show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let profiles: Awaited<ReturnType<typeof getProfiles>> = [];

  // If Redis is unreachable we still want to emit the homepage entry rather
  // than fail the whole sitemap.
  try {
    profiles = await getProfiles();
  } catch (err) {
    console.error("sitemap: failed to load profiles", err);
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...profiles.map((profile) => ({
      url: `${SITE_URL}/people/${profile.id}`,
      lastModified: profile.updatedAt ? new Date(profile.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
