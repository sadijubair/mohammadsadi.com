import { client } from "@/lib/sanity"

export default async function sitemap() {
  const baseUrl = "https://mohammadsadi.com"

  const posts = await client.fetch(`
    *[_type == "post"]{
      "slug": slug.current,
      _updatedAt
    }
  `)

  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post._updatedAt,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
  ]
}