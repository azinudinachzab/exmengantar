import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/db";
import { SITE_NAME } from "@/lib/site";

export const alt = "Profile — open to work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-profile social card so a shared profile shows the person's name and
// role, not just the site brand. Falls back gracefully if Redis is down or
// the profile was deleted.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let name = "Open to Work";
  let title = "";
  let tagline = "";

  try {
    const profile = await getProfile(id);
    if (profile) {
      name = profile.name;
      title = profile.title;
      tagline = [
        profile.previousCompany.length > 0 &&
          `Previously at ${profile.previousCompany.join(", ")}`,
        profile.location && `Based in ${profile.location}`,
      ]
        .filter(Boolean)
        .join("  ·  ");
    }
  } catch {
    // keep defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f5f0",
          color: "#14181f",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "monospace",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#2f7a4f",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#2f7a4f",
              display: "flex",
            }}
          />
          Available now
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: `14px solid ${"#b8860b"}`,
            paddingLeft: 44,
          }}
        >
          <div
            style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1.05 }}
          >
            {name}
          </div>
          {title && (
            <div
              style={{ display: "flex", marginTop: 20, fontSize: 48, color: "#4a5160" }}
            >
              {title}
            </div>
          )}
          {tagline && (
            <div
              style={{ display: "flex", marginTop: 24, fontSize: 32, color: "#4a5160" }}
            >
              {tagline}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "3px solid #dcd6c9",
            paddingTop: 28,
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>{SITE_NAME}</div>
          <div style={{ display: "flex", color: "#4a5160" }}>
            View full profile →
          </div>
        </div>
      </div>
    ),
    size
  );
}
