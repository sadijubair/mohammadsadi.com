import { client } from "@/lib/sanity"
import { CATEGORIES } from "@/lib/categories"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammadsadi.com"

type FeedPost = {
  title: string
  slug: string
  publishedAt?: string
  _createdAt: string
  excerpt?: string
  categories?: { title: string; slug: string }[]
  author?: { name?: string }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  let posts: FeedPost[] = []

  try {
    posts = await client.fetch<FeedPost[]>(`
      *[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc)[0..49]{
        title,
        "slug": slug.current,
        publishedAt,
        _createdAt,
        "excerpt": array::join(
          body[_type == "block" && style == "normal"][0..2]
            .children[_type == "span"]
            .text,
          " "
        ),
        categories[]->{ title, "slug": slug.current },
        author->{ name }
      }
    `)
  } catch {
    posts = []
  }

  const categoryMap = new Map(CATEGORIES.map((c) => [c.href.replace("/category/", ""), c.label]))

  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/post/${post.slug}`
      const pubDate = new Date(post.publishedAt ?? post._createdAt).toUTCString()
      const summary = post.excerpt ? escapeXml(post.excerpt.slice(0, 300)) : ""
      const categories = (post.categories ?? [])
        .map((c) => `<category>${escapeXml(categoryMap.get(c.slug) ?? c.title)}</category>`)
        .join("\n      ")

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.author?.name ? `<author>${escapeXml(post.author.name)}</author>` : ""}
      ${summary ? `<description>${summary}</description>` : ""}
      ${categories}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mohammad Sadi</title>
    <link>${BASE_URL}</link>
    <description>Independent writing by Mohammad Sadi on politics, technology, Islamic thought and opinion.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/og-default.png</url>
      <title>Mohammad Sadi</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
