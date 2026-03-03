import { client } from "@/lib/sanity"
import FooterClient from "./FooterClient"

type TopCategory = {
  title: string
  slug: { current: string }
  postCount: number
}

async function getTopTopics() {
  try {
    const data = await client.fetch<TopCategory[]>(
      `*[_type == "category"]{
        title,
        slug,
        "postCount": count(*[_type == "post" && references(^._id)])
      } | order(postCount desc)[0...5]`
    )
    return data.map((c) => ({
      label: c.title,
      href: `/category/${c.slug.current}`,
    }))
  } catch {
    return []
  }
}

export default async function Footer() {
  const topTopics = await getTopTopics()
  return <FooterClient topTopics={topTopics} />
}
