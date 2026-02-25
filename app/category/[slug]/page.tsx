import { client } from '@/lib/sanity'
import Link from 'next/link'

async function getPostsByCategory(slug: string) {
  return await client.fetch(
    `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
      title,
      slug,
      publishedAt
    }`,
    { slug }
  )
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = await getPostsByCategory(slug)

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">{slug}</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post: any) => (
        <div key={post.slug.current} className="mb-4">
          <Link
            href={`/post/${post.slug.current}`}
            className="text-blue-600 text-lg"
          >
            {post.title}
          </Link>
        </div>
      ))}
    </main>
  )
}