import { client } from "@/lib/sanity"
import { CATEGORY_SLUGS } from "@/lib/categories"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammadsadi.com"

type SanityPost = {
  slug: string
  _updatedAt: string
}

export default async function sitemap() {
  const posts = await client.fetch<SanityPost[]>(`
    *[_type == "post"]{
      "slug": slug.current,
      _updatedAt
    }
  `)

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/post/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryUrls = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    ...categoryUrls,
    ...postUrls,
  ]
}