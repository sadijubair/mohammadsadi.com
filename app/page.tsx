import { client } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
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
  const categorySections = [
    { title: "Politics", href: "/category/politics", posts: data.politics },
    { title: "Tech",     href: "/category/tech",     posts: data.tech },
    { title: "Islamic",  href: "/category/islam",    posts: data.islam },
  ]
  const latestImageUrl = getFeaturedImageUrl(data.latest, 1500, 860)

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative w-full overflow-hidden border-b-2 border-black bg-white">

        {/* Decorative large ghost text */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 bottom-0 select-none font-serif text-[clamp(8rem,28vw,22rem)] font-black leading-none tracking-tighter text-zinc-100"
        >
          SADI
        </span>

        <div className="relative mx-auto grid min-h-[80vh] max-w-7xl grid-cols-1 lg:grid-cols-2">

          {/* ── Left: copy ── */}
          <div className="flex flex-col justify-between border-black px-6 py-14 lg:border-r lg:px-14 lg:py-16">
            <div>
              {/* Run-of-paper label */}
              <div className="flex items-center gap-3">
                <div className="h-4 w-1 bg-black" />
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-zinc-400">
                  Independent Writing · Est. 2024
                </p>
              </div>

              {/* Headline */}
              <h1 className="mt-8 font-serif text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.92] tracking-tighter text-black">
                Mohammad<br />Sadi
              </h1>

              {/* Deck text */}
              <p className="mt-7 max-w-sm border-l-2 border-black pl-4 text-sm leading-relaxed text-zinc-500 md:text-base">
                Political commentary, technology insight, Islamic reflection,
                and bold opinion — crafted for readers who want clarity over noise.
              </p>
            </div>

            {/* CTA + categories */}
            <div className="mt-12">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#newsletter"
                  className="inline-block border-2 border-black bg-black px-7 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-colors duration-150 hover:bg-white hover:text-black"
                >
                  Subscribe
                </Link>
                <Link
                  href="/category/opinion"
                  className="inline-block border-2 border-black px-7 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-black transition-colors duration-150 hover:bg-black hover:text-white"
                >
                  Read Opinion
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-1 border-t border-zinc-200 pt-6">
                {[
                  { label: "Politics", href: "/category/politics" },
                  { label: "Technology", href: "/category/tech" },
                  { label: "Islam", href: "/category/islam" },
                  { label: "Opinion", href: "/category/opinion" },
                ].map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 transition-colors duration-150 hover:text-black"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: portrait ── */}
          <div className="relative flex items-end justify-center overflow-hidden bg-zinc-50 px-8 pt-10 lg:items-end lg:justify-end lg:px-16">
            {/* Rotated label */}
            <span
              aria-hidden="true"
              className="absolute left-5 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 lg:left-6"
            >
              Personal Journal
            </span>

            <div className="relative z-10 w-full max-w-sm lg:max-w-none">
              {/* Number tag */}
              <div className="absolute -left-3 -top-3 z-20 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-black">
                01
              </div>
              <Image
                src="/profile.jpeg"
                alt="Mohammad Sadi"
                width={600}
                height={720}
                priority
                className="relative block h-auto w-full object-cover object-top"
                style={{ aspectRatio: "5/6" }}
              />
            </div>
          </div>

        </div>
      </section>

      <section className="relative min-h-screen w-full bg-white">

        <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          {/* ═══════════════════════════════════════════════
              FEATURED STORY
          ═══════════════════════════════════════════════ */}
          {data.latest && (
            <section className="mb-16">
              {/* Section label row */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.45em] text-black">Featured Story</span>
                <div className="h-px flex-1 bg-black" />
              </div>

              <Link
                href={`/post/${data.latest.slug.current}`}
                className="group grid gap-0 overflow-hidden border border-black md:grid-cols-[1.1fr_0.9fr]"
              >
                {/* Image */}
                {latestImageUrl ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={latestImageUrl}
                      alt={getFeaturedImageAlt(data.latest)}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-zinc-100" />
                )}

                {/* Text pane */}
                <div className="flex flex-col justify-between border-l-0 border-black bg-white p-8 md:border-l lg:p-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                      {formatDate(data.latest.publishedAt)}
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-black leading-tight tracking-tight text-black xl:text-5xl">
                      {data.latest.title}
                    </h2>
                  </div>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black transition-all duration-200 group-hover:tracking-[0.5em]">
                      Read Full Story
                    </span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* ═══════════════════════════════════════════════
              RECENT POSTS — newspaper index list
          ═══════════════════════════════════════════════ */}
          {data.posts.length > 0 && (
            <section className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.45em] text-black">Latest Posts</span>
                <div className="h-px flex-1 bg-black" />
              </div>

              {/* Top 2 — card with image */}
              <div className="mb-0 grid border-b border-black md:grid-cols-2">
                {data.posts.slice(0, 2).map((post, i) => {
                  const img = getFeaturedImageUrl(post, 900, 540)
                  return (
                    <Link
                      key={post.slug.current}
                      href={`/post/${post.slug.current}`}
                      className={`group flex flex-col border-black p-6 transition-colors duration-150 hover:bg-zinc-50 ${i === 0 ? "border-b border-black md:border-b-0 md:border-r" : ""}`}
                    >
                      {img && (
                        <div className="relative mb-5 aspect-[16/9] overflow-hidden">
                          <Image
                            src={img}
                            alt={getFeaturedImageAlt(post)}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            {formatDate(post.publishedAt)}
                          </p>
                          <h3 className="mt-3 font-serif text-2xl font-black leading-tight text-black xl:text-3xl">
                            {post.title}
                          </h3>
                        </div>
                        <div className="mt-5 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-black">
                          Read
                          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Remaining 4 — index rows */}
              <div>
                {data.posts.slice(2).map((post, i) => (
                  <Link
                    key={post.slug.current}
                    href={`/post/${post.slug.current}`}
                    className="group flex items-baseline justify-between gap-6 border-b border-zinc-200 px-2 py-4 transition-colors duration-150 hover:bg-zinc-50 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-5 overflow-hidden">
                      <span className="shrink-0 font-serif text-4xl font-black leading-none text-zinc-100">
                        {String(i + 3).padStart(2, "0")}
                      </span>
                      <h3 className="truncate font-serif text-lg font-bold text-black">
                        {post.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      {formatDate(post.publishedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════
              CATEGORY EDITIONS
          ═══════════════════════════════════════════════ */}
          <section className="space-y-14">
            {categorySections.map((section) => {
              const [lead, ...rest] = section.posts
              const leadImg = getFeaturedImageUrl(lead, 1200, 700)
              return (
                <div key={section.title} className="border-t-2 border-black pt-8">
                  {/* Category row header */}
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <h2 className="font-serif text-5xl font-black uppercase leading-none tracking-tight text-black md:text-7xl">
                      {section.title}
                    </h2>
                    <Link
                      href={section.href}
                      className="group flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 transition-colors duration-150 hover:text-black"
                    >
                      All {section.title}
                      <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {lead ? (
                    <div className="grid gap-0 border border-black md:grid-cols-[1.4fr_0.6fr]">
                      {/* Lead post */}
                      <Link
                        href={`/post/${lead.slug.current}`}
                        className="group border-b border-black md:border-b-0 md:border-r"
                      >
                        {leadImg && (
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={leadImg}
                              alt={getFeaturedImageAlt(lead)}
                              fill
                              sizes="(max-width: 768px) 100vw, 60vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-serif text-2xl font-black leading-tight text-black md:text-3xl">
                            {lead.title}
                          </h3>
                          <div className="mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-black">
                            Read
                            <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </Link>

                      {/* Sidebar list */}
                      <div className="flex flex-col divide-y divide-zinc-200">
                        {(rest.length > 0 ? rest : Array(2).fill(null)).map((post, idx) =>
                          post ? (
                            <Link
                              key={post.slug.current}
                              href={`/post/${post.slug.current}`}
                              className="group flex flex-1 flex-col justify-between p-5 transition-colors duration-150 hover:bg-zinc-50"
                            >
                              <span className="font-serif text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                                0{idx + 2}
                              </span>
                              <p className="mt-2 font-serif text-base font-bold leading-snug text-black group-hover:underline">
                                {post.title}
                              </p>
                            </Link>
                          ) : (
                            <div key={idx} className="flex flex-1 items-center p-5 text-xs text-zinc-300">—</div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">No posts yet in this category.</p>
                  )}
                </div>
              )
            })}
          </section>

        </main>
      </section>
    </>
  )
}
