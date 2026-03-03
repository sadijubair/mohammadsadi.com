import { client } from "@/lib/sanity"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { urlFor } from "@/lib/image"
import { CATEGORY_SLUGS, getCategoryMeta } from "@/lib/categories"

export const revalidate = 60

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }))
}

type SanityImage = {
  alt?: string
  [key: string]: unknown
}

type Post = {
  title: string
  slug: {
    current: string
  }
  publishedAt?: string
  featuredImage?: SanityImage
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const theme = getCategoryMeta(slug)
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohammadsadi.com'
  const catUrl = `${BASE_URL}/category/${slug}`
  return {
    title: `${theme.label} \u2013 Mohammad Sadi`,
    description: theme.description,
    alternates: { canonical: catUrl },
    openGraph: {
      title: `${theme.label} \u2013 Mohammad Sadi`,
      description: theme.description,
      type: "website",
      url: catUrl,
      siteName: "Mohammad Sadi",
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(theme.label)}&label=Category`,
          width: 1200,
          height: 630,
          alt: theme.label,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme.label} \u2013 Mohammad Sadi`,
      description: theme.description,
      images: [`${BASE_URL}/api/og?title=${encodeURIComponent(theme.label)}&label=Category`],
    },
  }
}

const formatDate = (value?: string) => {
  if (!value) return "Recently published"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const getFeaturedImageUrl = (post?: Post, width = 1200, height = 720) => {
  if (!post?.featuredImage) return null
  return urlFor(post.featuredImage).width(width).height(height).url()
}

const getFeaturedImageAlt = (post?: Post) => {
  if (!post) return "Featured image"
  return post.featuredImage?.alt || post.title
}

async function getPostsByCategory(slug: string) {
  try {
    return await client.fetch<Post[]>(
      `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
        title,
        slug,
        publishedAt,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      }`,
      { slug }
    )
  } catch (err) {
    console.error("[getPostsByCategory] Sanity fetch failed:", err)
    return []
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = await getPostsByCategory(slug)

  // Return 404 for slugs that aren't in our known categories and have no posts
  const isKnownCategory = CATEGORY_SLUGS.includes(slug)
  if (!isKnownCategory && posts.length === 0) notFound()

  const theme = getCategoryMeta(slug)

  const leadPost = posts[0]
  const leadImageUrl = getFeaturedImageUrl(leadPost, 1500, 850)
  const headlinePosts = posts.slice(1, 5)
  const archivePosts = posts.slice(5)
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohammadsadi.com'
  const catUrl = `${BASE_URL}/category/${slug}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: theme.label, item: catUrl },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${theme.label} – Mohammad Sadi`,
    description: theme.description,
    url: catUrl,
    isPartOf: { "@type": "WebSite", name: "Mohammad Sadi", url: BASE_URL },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Category header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 border-b border-border py-3 text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">{theme.label}</span>
          </div>

          {/* Header grid */}
          <div className="grid gap-0 py-10 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Category</p>
              <h1 className="mt-3 text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.88] tracking-tighter text-foreground">
                {theme.label}
              </h1>
              <p className="mt-5 max-w-xl border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {theme.description}
              </p>
            </div>
            <div className="hidden shrink-0 text-right md:block">
              <p className="text-[5rem] font-black leading-none tracking-tighter text-border">
                {String(posts.length).padStart(2, "0")}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                Article{posts.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Posts â”€â”€ */}
      <main className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="rounded-lg border border-border p-10 text-center">
              <h2 className="text-2xl font-black text-foreground">No posts yet</h2>
              <p className="mt-3 text-sm text-muted-foreground">New articles in this category will appear here.</p>
              <Link href="/" className="mt-6 inline-block rounded-md border border-border px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.3em] text-foreground transition-colors hover:bg-primary hover:border-primary hover:text-primary-foreground">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              {/* Lead post */}
              {leadPost && (
                <section className="mb-14">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.45em] text-foreground">Lead Story</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <Link
                    href={`/post/${leadPost.slug.current}`}
                    className="group grid gap-0 overflow-hidden rounded-lg border border-border md:grid-cols-[1.2fr_0.8fr]"
                  >
                    {leadImageUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={leadImageUrl}
                          alt={getFeaturedImageAlt(leadPost)}
                          fill
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-muted" />
                    )}
                    <div className="flex flex-col justify-between border-l-0 border-border bg-card p-7 md:border-l lg:p-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                          {formatDate(leadPost.publishedAt)}
                        </p>
                        <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-card-foreground xl:text-4xl">
                          {leadPost.title}
                        </h2>
                      </div>
                      <div className="mt-7 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                        Read Full Story
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              {/* Posts 2â€“5 â€” two-column image cards */}
              {headlinePosts.length > 0 && (
                <section className="mb-14">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.45em] text-foreground">More Stories</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-1 gap-px rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {headlinePosts.map((post, i) => {
                      const img = getFeaturedImageUrl(post, 700, 420)
                      return (
                        <Link
                          key={post.slug.current}
                          href={`/post/${post.slug.current}`}
                          className={`group flex flex-col bg-card transition-colors duration-150 hover:bg-accent/50 ${i === 0 ? "rounded-tl-lg rounded-bl-lg" : ""} ${i === headlinePosts.length - 1 ? "rounded-tr-lg rounded-br-lg" : ""}`}
                        >
                          {img ? (
                            <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
                              <Image
                                src={img}
                                alt={getFeaturedImageAlt(post)}
                                fill
                                sizes="(max-width: 640px) 100vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] border-b border-border bg-muted" />
                          )}
                          <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                                {formatDate(post.publishedAt)}
                              </p>
                              <h3 className="mt-2 text-lg font-black leading-tight text-foreground">
                                {post.title}
                              </h3>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground group-hover:text-primary">
                              Read
                              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Archive â€” index rows */}
              {archivePosts.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.45em] text-foreground">Archive</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="border-t border-border">
                    {archivePosts.map((post, i) => (
                      <Link
                        key={post.slug.current}
                        href={`/post/${post.slug.current}`}
                        className="group flex items-baseline justify-between gap-6 border-b border-border px-2 py-4 transition-colors duration-150 hover:bg-accent/50"
                      >
                        <div className="flex items-baseline gap-5 overflow-hidden">
                          <span className="shrink-0 text-3xl font-black leading-none text-border">
                            {String(i + 6).padStart(2, "0")}
                          </span>
                          <h4 className="truncate text-lg font-bold text-foreground group-hover:underline">
                            {post.title}
                          </h4>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
