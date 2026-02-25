import { client } from "@/lib/sanity"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"

/* =========================
   Fetch Single Post
========================= */
async function getPost(slug: string) {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      publishedAt,
      categories[]->{
        title,
        slug
      }
    }`,
    { slug }
  )
}

/* =========================
   Dynamic SEO Metadata
========================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: `Read: ${post.title}`,
    openGraph: {
      title: post.title,
      description: `Read: ${post.title}`,
      type: "article",
    },
  }
}

/* =========================
   Article Page
========================= */
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return notFound()

  /* =========================
     Google Article Schema
  ========================= */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Sadi",
    },
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories?.map((cat: any) => (
            <span
              key={cat.slug.current}
              className="text-xs uppercase tracking-wide bg-gray-100 px-3 py-1 rounded-full"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        {/* Publish Date */}
        {post.publishedAt && (
          <p className="text-sm text-gray-500 mb-8">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}

        {/* Divider */}
        <div className="border-b mb-8"></div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </article>

      </main>
    </>
  )
}