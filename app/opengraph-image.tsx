import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — laid-off tech talent open to work`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand card shown when the homepage is shared on social / chat apps.
export default function OpengraphImage() {
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
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#2f7a4f",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#2f7a4f",
              display: "flex",
            }}
          />
          Open to work
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            IT Engineers, Product Managers &amp; Designers.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 36,
              color: "#4a5160",
            }}
          >
            A vetted roster of laid-off talent — every profile referred by a
            former teammate.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "3px solid #dcd6c9",
            paddingTop: 28,
            fontSize: 30,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>{SITE_NAME}</div>
          <div style={{ display: "flex", color: "#b8860b" }}>
            Browse the roster →
          </div>
        </div>
      </div>
    ),
    size
  );
}
