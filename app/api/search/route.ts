import { client } from "@/lib/sanity"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q) return NextResponse.json([])

  const posts = await client.fetch(
    `*[_type == "post" && title match $q][0..10]{
      title,
      "slug": slug.current
    }`,
    { q: `*${q}*` }
  )

  return NextResponse.json(posts)
}