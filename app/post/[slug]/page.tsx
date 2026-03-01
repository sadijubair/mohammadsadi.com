import { client } from "@/lib/sanity"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import type { PortableTextComponents } from "@portabletext/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { urlFor } from "@/lib/image"

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammadsadi.com"

/** Escape JSON for safe inline script injection (prevents XSS via </script>) */
function escapeJson(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

type Category = {
  _id: string
  title: string
  slug: {
    current: string
  }
}

type Author = {
  name?: string
  bio?: PortableTextBlock[]
  image?: unknown
  twitter?: string
  facebook?: string
  github?: string
  website?: string
}

type SanityImage = {
  alt?: string
  [key: string]: unknown
}

type Post = {
  _id: string
  title: string
  body?: PortableTextBlock[]
  publishedAt?: string
  _createdAt?: string
  featuredImage?: SanityImage
  categories?: Category[]
  author?: Author
}

type RelatedPost = {
  title: string
  slug: {
    current: string
  }
  publishedAt?: string
}

type Heading = {
  id: string
  text: string
  level: 2 | 3
  key: string
}

const formatDate = (value?: string) => {
  if (!value) return null

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const estimateReadingMinutes = (body?: PortableTextBlock[]) => {
  if (!body?.length) return 1

  const text = body
    .map((block) =>
      "children" in block && Array.isArray(block.children)
        ? block.children
            .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
            .join(" ")
        : ""
    )
    .join(" ")

  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

const blockToPlainText = (block?: PortableTextBlock) => {
  if (!block || !("children" in block) || !Array.isArray(block.children)) return ""

  return block.children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join(" ")
    .trim()
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

const buildHeadings = (body?: PortableTextBlock[]) => {
  if (!body?.length) return []

  const counts = new Map<string, number>()
  const headings: Heading[] = []

  body.forEach((block, index) => {
    if (!("style" in block) || (block.style !== "h2" && block.style !== "h3")) return

    const text = blockToPlainText(block)
    if (!text) return

    const base = toSlug(text) || `section-${index + 1}`
    const count = (counts.get(base) ?? 0) + 1
    counts.set(base, count)

    headings.push({
      id: count > 1 ? `${base}-${count}` : base,
      text,
      level: block.style === "h2" ? 2 : 3,
      key: typeof block._key === "string" ? block._key : `${base}-${index}`,
    })
  })

  return headings
}

async function getPost(slug: string) {
  return await client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      body,
      publishedAt,
      _createdAt,
      "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image){
        ...,
        asset->{_id, url, metadata}
      },
      categories[]->{
        _id,
        title,
        slug
      },
      author->{
        name,
        bio,
        image,
        twitter,
        facebook,
        github,
        website
      }
    }`,
    { slug }
  )
}

async function getRelatedPosts(categoryIds: string[], currentId: string) {
  if (!categoryIds.length) return []

  try {
    return await client.fetch<RelatedPost[]>(
      `*[
        _type == "post" &&
        _id != $currentId &&
        count((categories[]._ref)[@ in $categoryIds]) > 0
      ] | order(publishedAt desc) [0..3]{
        title,
        slug,
        publishedAt
      }`,
      { categoryIds, currentId }
    )
  } catch (err) {
    console.error("[getRelatedPosts] Sanity fetch failed:", err)
    return []
  }
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch<{ slug: string }[]>(
      `*[_type == "post"]{"slug": slug.current}`
    )
    return posts.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return {}

  const postUrl = `${BASE_URL}/post/${slug}`
  const categoryLabel = post.categories?.[0]?.title ?? ""
  const ogImageUrl = post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}${categoryLabel ? `&label=${encodeURIComponent(categoryLabel)}` : ""}` 

  const description = (() => {
    if (!post.body) return `Read: ${post.title}`
    const text = post.body
      .filter(
        (b): b is PortableTextBlock =>
          "style" in b && b.style === "normal" && "children" in b && Array.isArray(b.children)
      )
      .slice(0, 3)
      .map((b) =>
        (b.children as { text?: string }[])
          .map((c) => (typeof c.text === "string" ? c.text : ""))
          .join("")
      )
      .join(" ")
      .slice(0, 160)
      .trim()
    return text || `Read: ${post.title}`
  })()

  return {
    title: `${post.title} - Mohammad Sadi`,
    description,
    keywords: post.categories?.map((c) => c.title) ?? [],
    authors: post.author?.name ? [{ name: post.author.name }] : [{ name: "Mohammad Sadi" }],
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: postUrl,
      siteName: "Mohammad Sadi",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt ?? post._createdAt,
      authors: post.author?.name ? [post.author.name] : [],
      tags: post.categories?.map((c) => c.title),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImageUrl],
    },
}
  }

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return notFound()

  const categoryIds = post.categories?.map((category) => category._id) ?? []
  const [related] = await Promise.all([
    getRelatedPosts(categoryIds, post._id),
  ])

  const readingMinutes = estimateReadingMinutes(post.body)
  const headings = buildHeadings(post.body)
  const headingIdByKey = new Map(headings.map((item) => [item.key, item.id]))

  const authorLinks = [
    { label: "Website", href: post.author?.website },
    { label: "Twitter", href: post.author?.twitter },
    { label: "Facebook", href: post.author?.facebook },
    { label: "GitHub", href: post.author?.github },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))

  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(120).height(120).url() : null
  const featuredImageUrl = post.featuredImage ? urlFor(post.featuredImage).width(1800).height(1000).url() : null
  const featuredImageAlt = post.featuredImage?.alt || post.title
  const postUrl = `${BASE_URL}/post/${slug}`
  const encodedTitle = encodeURIComponent(post.title)
  const encodedUrl = encodeURIComponent(postUrl)
  const shareLinks = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${post.title}\n\n${postUrl}`)}` },
  ]

  const portableComponents: PortableTextComponents = {
    block: {
      h2: ({ children, value }) => {
        const id = value?._key ? headingIdByKey.get(value._key) : undefined
        return (
          <h2 id={id} className="mt-14 scroll-mt-28 font-serif text-[1.9rem] font-black leading-tight tracking-tight text-zinc-950">
            {children}
          </h2>
        )
      },
      h3: ({ children, value }) => {
        const id = value?._key ? headingIdByKey.get(value._key) : undefined
        return (
          <h3 id={id} className="mt-10 scroll-mt-28 font-serif text-2xl font-bold leading-snug text-zinc-900">
            {children}
          </h3>
        )
      },
      blockquote: ({ children }) => (
        <blockquote className="relative my-12 border-l-4 border-zinc-950 pl-8">
          <span className="absolute -left-2 -top-4 font-serif text-7xl font-black leading-none text-zinc-200 select-none">&ldquo;</span>
          <p className="relative font-serif text-2xl font-bold italic leading-relaxed text-zinc-800">{children}</p>
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href = typeof value?.href === "string" ? value.href : "#"
        const external = /^https?:\/\//.test(href)
        return (
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} className="border-b-2 border-zinc-950 font-semibold text-zinc-950 transition-colors hover:border-transparent hover:text-zinc-500">
            {children}
          </a>
        )
      },
      code: ({ children }) => (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.88em] font-semibold text-zinc-800">{children}</code>
      ),
    },
  }

  const articleDescription = (() => {
    if (!post.body) return post.title
    return post.body
      .filter((b): b is PortableTextBlock =>
        "style" in b && b.style === "normal" && "children" in b && Array.isArray(b.children)
      )
      .slice(0, 2)
      .map((b) => (b.children as { text?: string }[]).map((c) => c.text ?? "").join(""))
      .join(" ")
      .slice(0, 200)
      .trim() || post.title
  })()

  const wordCount = (() => {
    if (!post.body) return undefined
    const text = post.body
      .map((b) =>
        "children" in b && Array.isArray(b.children)
          ? (b.children as { text?: string }[]).map((c) => c.text ?? "").join(" ")
          : ""
      )
      .join(" ")
    return text.trim().split(/\s+/).filter(Boolean).length || undefined
  })()

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: postUrl,
    datePublished: post.publishedAt ?? post._createdAt,
    dateModified: post.publishedAt ?? post._createdAt,
    description: articleDescription,
    image: featuredImageUrl ? [featuredImageUrl] : undefined,
    inLanguage: "en-US",
    ...(wordCount ? { wordCount } : {}),
    ...(post.categories?.length ? { articleSection: post.categories[0].title, keywords: post.categories.map((c) => c.title).join(", ") } : {}),
    author: {
      "@type": "Person",
      name: post.author?.name || "Mohammad Sadi",
      url: BASE_URL,
      sameAs: [
        "https://x.com/mohammadsadi",
        "https://linkedin.com/in/mohammadsadi",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Mohammad Sadi",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-default.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Mohammad Sadi",
      url: BASE_URL,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...(post.categories?.[0]
        ? [{ "@type": "ListItem", position: 2, name: post.categories[0].title, item: `${BASE_URL}/category/${post.categories[0].slug.current}` }]
        : []),
      { "@type": "ListItem", position: post.categories?.length ? 3 : 2, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJson(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJson(breadcrumbSchema) }}
      />

      {/* Dark cinematic masthead */}
      <header className="bg-zinc-950 pb-16 pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Top nav row */}
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 transition-colors hover:text-white"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 1L3 6l5 5" />
              </svg>
              Back
            </Link>
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2">
                {post.categories.map((cat) => (
                  <Link
                    key={cat.slug.current}
                    href={`/category/${cat.slug.current}`}
                    className="border border-zinc-700 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400 transition-colors hover:border-white hover:text-white"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.2rem)] font-black leading-[1.05] tracking-tight text-white">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-800 pt-6 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            {post.author?.name && (
              <span className="text-zinc-300">{post.author.name}</span>
            )}
            <span>{formatDate(post.publishedAt ?? post._createdAt)}</span>
            <span>{readingMinutes} min read</span>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {featuredImageUrl && (
        <div className="bg-zinc-950">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={featuredImageUrl}
                alt={featuredImageAlt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="bg-white">
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Sticky share bar  left of reading column (xl+) */}
          <div className="absolute -left-20 top-16 hidden xl:block">
            <div className="sticky top-28 flex flex-col items-center gap-3">
              <span
                className="mb-1 text-[9px] font-black uppercase tracking-[0.45em] text-zinc-300"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
              >
                Share
              </span>
              {shareLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share on ${item.label}`}
                  className="flex h-9 w-9 items-center justify-center border border-zinc-200 text-[10px] font-black uppercase text-zinc-400 transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                >
                  {item.label.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Article */}
          <article>
            <div className="prose prose-zinc max-w-none text-[1.08rem] leading-[1.9] prose-p:text-zinc-700 prose-p:my-6 prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-zinc-950 prose-h2:text-[1.9rem] prose-h2:font-black prose-h2:mt-14 prose-h2:mb-4 prose-h2:scroll-mt-28 prose-h3:text-[1.4rem] prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-3 prose-h3:scroll-mt-28 prose-strong:text-zinc-950 prose-strong:font-bold prose-li:text-zinc-700 prose-li:my-1 prose-ul:my-6 prose-ol:my-6 prose-blockquote:not-italic prose-blockquote:border-none prose-blockquote:p-0 prose-blockquote:m-0 prose-code:text-[0.88em] prose-code:font-mono prose-code:font-semibold prose-code:text-zinc-800 prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-a:text-zinc-950 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-zinc-500 prose-img:border prose-img:border-zinc-100">
              <PortableText value={post.body ?? []} components={portableComponents} />
            </div>

            {/* Mobile share */}
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-8 xl:hidden">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Share</span>
              {shareLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Tags */}
            {post.categories && post.categories.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Filed under</span>
                {post.categories.map((cat) => (
                  <Link
                    key={cat.slug.current}
                    href={`/category/${cat.slug.current}`}
                    className="bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 transition-colors hover:bg-zinc-950 hover:text-white"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Author card */}
          {post.author && (
            <div className="mt-16 flex gap-0 border border-zinc-200">
              <div className="w-1.5 flex-shrink-0 bg-zinc-950" />
              <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-start">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name || "Author"}
                    width={80}
                    height={80}
                    className="h-16 w-16 flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-zinc-950 font-serif text-2xl font-black text-white">
                    {(post.author.name || "S").charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Written by</p>
                  <p className="mt-1 font-serif text-2xl font-black text-zinc-950">{post.author.name || "Sadi"}</p>
                  {post.author.bio && (
                    <div className="mt-3 text-sm leading-relaxed text-zinc-500">
                      <PortableText value={post.author.bio} />
                    </div>
                  )}
                  {authorLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {authorLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-zinc-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50 py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-950">More to Read</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
              <div className="grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug.current}
                    href={`/post/${item.slug.current}`}
                    className="group block bg-white p-7 transition-colors hover:bg-zinc-50"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                      {formatDate(item.publishedAt ?? "")}
                    </p>
                    <h4 className="mt-3 font-serif text-lg font-black leading-snug tracking-tight text-zinc-950 group-hover:underline">
                      {item.title}
                    </h4>
                    <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 transition-colors group-hover:text-zinc-950">
                      Read
                      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6h8M6 2l4 4-4 4" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
