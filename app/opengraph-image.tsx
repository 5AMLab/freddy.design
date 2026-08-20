import { ImageResponse } from "next/og";

// Rendered at build time into a static PNG. Deliberately typographic rather
// than photographic: the studio's own work is the wrong thing to lead with in
// a link preview (the strongest image is the Hermès concept piece, which is
// exactly the work that should NOT be the studio's calling card).
export const runtime = "nodejs";
export const alt = "Studio Kavea — Brand & Creative Direction, Singapore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.18em",
            color: "#F25623",
            textTransform: "uppercase",
          }}
        >
          Studio Kavea
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#F9F9F9",
            maxWidth: 900,
          }}
        >
          Brands built to be remembered in a world built to forget.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(249,249,249,0.6)",
          }}
        >
          Brand & Creative Direction · Singapore
        </div>
      </div>
    ),
    size
  );
}
