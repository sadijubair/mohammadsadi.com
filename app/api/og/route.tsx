import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get("title") ?? "Mohammad Sadi"
  const desc = searchParams.get("desc") ?? "Politics, Technology & Independent Opinion"
  const label = searchParams.get("label") ?? ""

  const titleFontSize = title.length > 70 ? 46 : title.length > 50 ? 54 : 64

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 70px 50px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture lines */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 400,
            height: "100%",
            background:
              "linear-gradient(to right, transparent, #18181b)",
            display: "flex",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            width: 64,
            height: 4,
            background: "white",
            marginBottom: label ? 28 : 36,
            display: "flex",
          }}
        />

        {/* Category / page label */}
        {label ? (
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 13,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: 22,
              fontFamily: "Arial, Helvetica, sans-serif",
              display: "flex",
            }}
          >
            {label.toUpperCase()}
          </div>
        ) : null}

        {/* Title */}
        <div
          style={{
            color: "white",
            fontSize: titleFontSize,
            fontWeight: 900,
            lineHeight: 1.1,
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Description — only if no per-page label */}
        {!label && desc ? (
          <div
            style={{
              color: "#71717a",
              fontSize: 22,
              lineHeight: 1.5,
              marginBottom: 36,
              maxWidth: 760,
              fontFamily: "Arial, Helvetica, sans-serif",
              display: "flex",
            }}
          >
            {desc.length > 130 ? `${desc.slice(0, 127)}…` : desc}
          </div>
        ) : null}

        {/* Bottom divider + branding row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 22,
          }}
        >
          {/* Left: author name */}
          <div
            style={{
              color: "#e4e4e7",
              fontSize: 15,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "Arial, Helvetica, sans-serif",
              display: "flex",
            }}
          >
            MOHAMMAD SADI
          </div>

          {/* Right: domain */}
          <div
            style={{
              color: "#52525b",
              fontSize: 14,
              fontFamily: "Arial, Helvetica, sans-serif",
              display: "flex",
            }}
          >
            mohammadsadi.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
