import { client } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/image'
import type { Metadata } from 'next'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohammadsadi.com'

export const metadata: Metadata = {
  title: 'Mohammad Sadi \u2013 Political, Tech & Opinion Blog',
  description:
    'Independent writing by Mohammad Sadi on politics, geopolitics, technology, Islamic thought and opinion. Insightful long-form essays and analysis.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Mohammad Sadi \u2013 Political, Tech & Opinion Blog',
    description:
      'Independent writing by Mohammad Sadi on politics, geopolitics, technology, Islamic thought and opinion.',
    url: BASE_URL,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Mohammad+Sadi&desc=Politics%2C+Technology+%26+Independent+Opinion`,
        width: 1200,
        height: 630,
        alt: 'Mohammad Sadi – Independent Writing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Sadi \u2013 Political, Tech & Opinion Blog',
    description:
      'Independent writing by Mohammad Sadi on politics, geopolitics, technology, Islamic thought and opinion.',
    images: [
      `${BASE_URL}/api/og?title=Mohammad+Sadi&desc=Politics%2C+Technology+%26+Independent+Opinion`,
    ],
  },
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

type HomeData = {
  latest: Post | null
  posts: Post[]
  politics: Post[]
  tech: Post[]
  islam: Post[]
}

const formatDate = (value?: string) => {
  if (!value) return "Recently published"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const getFeaturedImageUrl = (post?: Post | null, width = 1200, height = 720) => {
  if (!post?.featuredImage) return null
  return urlFor(post.featuredImage).width(width).height(height).url()
}

const getFeaturedImageAlt = (post?: Post | null) => {
  if (!post) return "Featured image"
  return post.featuredImage?.alt || post.title
}

const EMPTY_DATA: HomeData = { latest: null, posts: [], politics: [], tech: [], islam: [] }

async function getData(): Promise<HomeData> {
  try {
    return await client.fetch<HomeData>(`
    {
      "latest": *[_type == "post"] | order(publishedAt desc)[0]{
        title,
        slug,
        publishedAt,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      },
      "posts": *[_type == "post"] | order(publishedAt desc)[1..6]{
        title,
        slug,
        publishedAt,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      },
      "politics": *[_type == "post" && "politics" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      },
      "tech": *[_type == "post" && "tech" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      },
      "islam": *[_type == "post" && "islam" in categories[]->slug.current] | order(publishedAt desc)[0..3]{
        title,
        slug,
        "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
      }
    }
  `)
  } catch (err) {
    console.error("[getData] Sanity fetch failed:", err)
    return EMPTY_DATA
  }
}

export default async function Home() {
  const data = await getData()
  const latestImageUrl = getFeaturedImageUrl(data.latest, 1500, 860)

  return (
    <div className="min-h-screen bg-background">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-border bg-background">

        {/* line grid — same as footer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* radial fade so grid dissolves behind the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, var(--background) 30%, transparent 100%)",
          }}
        />
        {/* teal glow top-center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">

          {/* portrait */}
          <div className="mx-auto mb-8 h-36 w-36 overflow-hidden rounded-full border-4 border-background shadow-xl ring-2 ring-primary/30 sm:h-44 sm:w-44">
            <Image
              src="/profile.jpeg"
              alt="Mohammad Sadi"
              width={176}
              height={176}
              priority
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Independent Writing
          </div>

          {/* headline */}
          <h1 className="mt-8 font-extrabold leading-[0.9] tracking-tight text-foreground">
            <span className="block text-[clamp(2.8rem,7.5vw,6rem)]">Mohammad</span>
            <span className="block text-[clamp(3.5rem,10vw,8rem)] text-primary">Sadi</span>
          </h1>

          {/* rule */}
          <div className="mx-auto mt-8 flex items-center gap-4 max-w-sm">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">Personal Opinion</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* tagline */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Political commentary, technology insight, Islamic reflection —
            crafted for readers who want clarity over noise.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#newsletter"
              className="inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Subscribe
            </Link>
            <Link
              href="/post"
              className="inline-flex h-11 items-center rounded-md border border-border px-8 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:-translate-y-0.5"
            >
              Browse All Posts
            </Link>
          </div>

          {/* category links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { label: "Politics", href: "/category/politics" },
              { label: "Technology", href: "/category/tech" },
              { label: "Islam", href: "/category/islam" },
              { label: "Opinion", href: "/category/opinion" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {cat.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* ══════════════════════════════════════════
            FEATURED STORY — full-bleed image + side text
        ══════════════════════════════════════════ */}
        {data.latest && (
          <section className="mb-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Featured Story</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <Link
              href={`/post/${data.latest.slug.current}`}
              className="group relative flex min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-shadow hover:shadow-xl sm:min-h-[500px]"
            >
              {/* Image fills entire card */}
              {latestImageUrl ? (
                <Image
                  src={latestImageUrl}
                  alt={getFeaturedImageAlt(data.latest)}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-secondary" />
              )}
              {/* Dark gradient from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Content pinned to bottom-left */}
              <div className="relative mt-auto w-full p-8 md:p-12 lg:max-w-2xl">
                <p className="text-xs font-medium text-white/60">{formatDate(data.latest.publishedAt)}</p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl xl:text-4xl">
                  {data.latest.title}
                </h2>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition-all group-hover:bg-white/20">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ══════════════════════════════════════════
            LATEST POSTS — zigzag alternating layout
        ══════════════════════════════════════════ */}
        {data.posts.length > 0 && (
          <section className="mb-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Latest Posts</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-4">
              {data.posts.map((post, i) => {
                const img = getFeaturedImageUrl(post, 900, 540)
                const isEven = i % 2 === 0
                return (
                  <Link
                    key={post.slug.current}
                    href={`/post/${post.slug.current}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:min-h-[220px]"
                  >
                    {/* Image — left on even, right on odd (desktop) */}
                    <div className={`relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-2/5 ${isEven ? "sm:order-first" : "sm:order-last"}`}>
                      {img ? (
                        <Image
                          src={img}
                          alt={getFeaturedImageAlt(post)}
                          fill
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`flex flex-col justify-center gap-4 p-6 sm:p-8 ${isEven ? "" : ""}`}>
                      <p className="text-xs font-medium text-muted-foreground">{formatDate(post.publishedAt)}</p>
                      <h3 className="text-xl font-bold leading-snug tracking-tight text-card-foreground sm:text-2xl">
                        {post.title}
                      </h3>
                      <span className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary">
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            CATEGORY SECTIONS — each a distinct layout
        ══════════════════════════════════════════ */}
        <div className="space-y-20">

          {/* ── POLITICS — 3-column card grid ── */}
          {data.politics.length > 0 && (
            <section>
              <div className="mb-8 flex items-end justify-between gap-4 border-t border-border pt-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Politics</h2>
                <Link href="/category/politics" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary">
                  All Politics
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.politics.map((post) => {
                  const img = getFeaturedImageUrl(post, 700, 420)
                  return (
                    <Link
                      key={post.slug.current}
                      href={`/post/${post.slug.current}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {img ? (
                          <Image src={img} alt={getFeaturedImageAlt(post)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-secondary" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <p className="text-xs font-medium text-muted-foreground">{formatDate(post.publishedAt)}</p>
                        <h3 className="flex-1 text-base font-bold leading-snug text-card-foreground">{post.title}</h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          Read Article
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── TECH — newspaper horizontal thumbnail rows ── */}
          {data.tech.length > 0 && (
            <section>
              <div className="mb-8 flex items-end justify-between gap-4 border-t border-border pt-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Technology</h2>
                <Link href="/category/tech" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary">
                  All Tech
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                {data.tech.map((post) => {
                  const img = getFeaturedImageUrl(post, 300, 200)
                  return (
                    <Link
                      key={post.slug.current}
                      href={`/post/${post.slug.current}`}
                      className="group flex items-center gap-4 p-4 transition-colors hover:bg-accent/50 sm:gap-6 sm:p-5"
                    >
                      {/* Small thumbnail */}
                      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40">
                        {img ? (
                          <Image src={img} alt={getFeaturedImageAlt(post)} fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-secondary" />
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <p className="text-xs font-medium text-muted-foreground">{formatDate(post.publishedAt)}</p>
                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors sm:text-lg">
                          {post.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          Read Article
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── ISLAM — magazine cover overlays ── */}
          {data.islam.length > 0 && (
            <section>
              <div className="mb-8 flex items-end justify-between gap-4 border-t border-border pt-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Islamic</h2>
                <Link href="/category/islam" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary">
                  All Islamic
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {/* First post: wide hero cover */}
              {(() => {
                const [hero, ...rest] = data.islam
                const heroImg = getFeaturedImageUrl(hero, 1200, 600)
                return (
                  <div className="space-y-4">
                    <Link
                      href={`/post/${hero.slug.current}`}
                      className="group relative flex min-h-[300px] overflow-hidden rounded-2xl border border-border shadow-md transition-shadow hover:shadow-xl sm:min-h-[380px]"
                    >
                      {heroImg ? (
                        <Image src={heroImg} alt={getFeaturedImageAlt(hero)} fill sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-secondary" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="relative mt-auto p-7 md:p-10 lg:max-w-xl">
                        <p className="text-xs font-medium text-white/60">{formatDate(hero.publishedAt)}</p>
                        <h3 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl">{hero.title}</h3>
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition-all group-hover:bg-white/20">
                          Read Article
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>

                    {/* Remaining: smaller side-by-side covers */}
                    {rest.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {rest.map((post) => {
                          const img = getFeaturedImageUrl(post, 700, 420)
                          return (
                            <Link
                              key={post.slug.current}
                              href={`/post/${post.slug.current}`}
                              className="group relative flex min-h-[220px] overflow-hidden rounded-xl border border-border shadow-sm transition-shadow hover:shadow-lg"
                            >
                              {img ? (
                                <Image src={img} alt={getFeaturedImageAlt(post)} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-secondary" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                              <div className="relative mt-auto p-5">
                                <p className="text-[11px] font-medium text-white/60">{formatDate(post.publishedAt)}</p>
                                <h3 className="mt-1.5 text-sm font-bold leading-snug text-white sm:text-base">{post.title}</h3>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition-colors group-hover:text-white">
                                  Read Article
                                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}
            </section>
          )}

        </div>
      </main>
    </div>
  )
}
