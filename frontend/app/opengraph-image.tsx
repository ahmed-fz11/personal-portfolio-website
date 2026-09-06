import { ImageResponse } from "next/og"

// Generated at build time and served as the card image for every share of
// this link. Uses the site's own navy/teal palette so the preview reads as
// the same product as the page it opens.
export const runtime = "edge"
export const alt = "Ahmad Faraz — Full-Stack & ML Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0a192f",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: "#64ffda",
            fontFamily: "monospace",
          }}
        >
          FULL-STACK &amp; ML ENGINEER
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 96,
            fontWeight: 700,
            color: "#e2e8f0",
            letterSpacing: -3,
          }}
        >
          Ahmad Faraz.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 36,
            color: "#94a3b8",
            maxWidth: 900,
          }}
        >
          I build things for the web and AI.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 24,
            color: "#64ffda",
            fontFamily: "monospace",
          }}
        >
          personal-portfolio-website-pb2w.vercel.app
        </div>
      </div>
    ),
    size
  )
}
