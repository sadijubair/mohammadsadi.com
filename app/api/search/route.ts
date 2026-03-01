import { client } from "@/lib/sanity"
import { NextResponse } from "next/server"

// Simple in-memory rate limiter: max 30 requests per 60 s per IP
const rateMap = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateMap.get(ip)

  if (!record || now > record.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  record.count += 1
  if (record.count > MAX_REQUESTS) return true

  return false
}

export async function GET(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    )
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()

  if (!q) return NextResponse.json([])
  if (q.length > 100) return NextResponse.json([], { status: 400 })

  try {
    const posts = await client.fetch(
      `*[_type == "post" && title match $q][0..10]{
        title,
        "slug": slug.current
      }`,
      { q: `*${q}*` }
    )
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}