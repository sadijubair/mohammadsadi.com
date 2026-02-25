import { client } from '@/lib/sanity'
import Link from 'next/link'

async function getData() {
  return await client.fetch(`
    {
      "latest": *[_type == "post"] | order(publishedAt desc)[0],
      "posts": *[_type == "post"] | order(publishedAt desc)[1..6]{
        title,
        slug,
        publishedAt
      },
      "politics": *[_type == "post" && "politics" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug
      },
      "tech": *[_type == "post" && "tech" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug
      },
      "islam": *[_type == "post" && "islam" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug
      }
    }
  `)
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-12">

      {/* HERO */}
      {data.latest && (
        <section>
          <h2 className="text-sm uppercase text-gray-500 mb-2">Latest</h2>
          <Link href={`/post/${data.latest.slug.current}`}>
            <h1 className="text-4xl font-bold hover:underline">
              {data.latest.title}
            </h1>
          </Link>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {data.posts?.map((post: any) => (
            <Link
              key={post.slug.current}
              href={`/post/${post.slug.current}`}
              className="border p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Politics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Politics</h2>
        {data.politics?.map((post: any) => (
          <div key={post.slug.current}>
            <Link
              href={`/post/${post.slug.current}`}
              className="text-blue-600"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </section>

      {/* Tech */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tech</h2>
        {data.tech?.map((post: any) => (
          <div key={post.slug.current}>
            <Link
              href={`/post/${post.slug.current}`}
              className="text-blue-600"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </section>

      {/* Islamic */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Islamic</h2>
        {data.islam?.map((post: any) => (
          <div key={post.slug.current}>
            <Link
              href={`/post/${post.slug.current}`}
              className="text-blue-600"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </section>

    </main>
  )
}