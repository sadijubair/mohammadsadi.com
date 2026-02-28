import { client } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import type { PortableTextComponents } from "@portabletext/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { urlFor } from "@/lib/image"

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
  if (!value) return "Recently published"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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
      "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image),
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

  return await client.fetch<RelatedPost[]>(
    `*[
      _type == "post" &&
      _id != $currentId &&
      count((categories[]._ref)[@ in $categoryIds]) > 0
    ][0..3]{
      title,
      slug,
      publishedAt
    }`,
    { categoryIds, currentId }
  )
}

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return notFound()

  const readingMinutes = estimateReadingMinutes(post.body)
  const categoryIds = post.categories?.map((category) => category._id) ?? []
  const related = await getRelatedPosts(categoryIds, post._id)
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
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadsadi.com"}/post/${slug}`
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
          <h2 id={id} className="mt-12 scroll-mt-28 border-t border-slate-200 pt-8 font-serif text-3xl font-bold text-[var(--text-primary)]">
            {children}
          </h2>
        )
      },
      h3: ({ children, value }) => {
        const id = value?._key ? headingIdByKey.get(value._key) : undefined
        return (
          <h3 id={id} className="mt-8 scroll-mt-28 font-serif text-2xl font-semibold text-[var(--text-primary)]">
            {children}
          </h3>
        )
      },
    },
    marks: {
      link: ({ children, value }) => {
        const href = typeof value?.href === "string" ? value.href : "#"
        const external = /^https?:\/\//.test(href)
        return (
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined}>
            {children}
          </a>
        )
      },
      code: ({ children }) => (
        <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.92em] font-semibold text-slate-800">{children}</code>
      ),
    },
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    image: featuredImageUrl ? [featuredImageUrl] : undefined,
    author: {
      "@type": "Person",
      name: post.author?.name || "Sadi",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <section className="relative isolate overflow-hidden bg-[#0b1220] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,0.55),transparent_46%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.35),transparent_36%),linear-gradient(120deg,#0b1220_0%,#111827_45%,#0f172a_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(241,245,249,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,245,249,0.15)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="pointer-events-none absolute -right-24 top-8 h-56 w-56 rounded-full bg-[var(--accent)]/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
            <Link href="/" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 transition-colors duration-200 hover:bg-white/20">
              Home
            </Link>
            <span>/</span>
            <span>Post</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <Link
                key={category.slug.current}
                href={`/category/${category.slug.current}`}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-100 transition-colors duration-200 hover:bg-white/20"
              >
                {category.title}
              </Link>
            ))}
          </div>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-6xl">{post.title}</h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-200">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>{readingMinutes} min read</span>
            {post.author?.name && (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 z-0 opacity-80 [background-image:linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] [background-size:20px_20px] [mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [mask-composite:intersect] [-webkit-mask-composite:source-in]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(2,6,23,0.5)] md:p-10">
            {featuredImageUrl && (
              <figure className="mb-8 overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImageUrl} alt={featuredImageAlt} className="h-auto w-full object-cover" />
              </figure>
            )}

            <div className="prose prose-slate max-w-none text-[1.04rem] leading-8 prose-headings:font-serif prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:font-semibold prose-a:text-[var(--primary-start)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)] prose-ol:marker:text-[var(--primary-start)] prose-ul:marker:text-[var(--primary-start)]">
              <PortableText value={post.body ?? []} components={portableComponents} />
            </div>

            {related.length > 0 && (
              <section className="mt-12 border-t border-slate-200 pt-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">Related Articles</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Continue reading
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.slug.current}
                      href={`/post/${item.slug.current}`}
                      className="group rounded-xl border border-slate-200 bg-[var(--surface)]/45 p-4 transition-colors duration-200 hover:bg-[var(--surface)]"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                        {formatDate(item.publishedAt)}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary-start)]">
                        {item.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {headings.length > 0 && (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(2,6,23,0.45)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">On this page</p>
                <nav aria-label="Table of contents" className="mt-4 space-y-2">
                  {headings.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-lg px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-[var(--surface)] hover:text-[var(--primary-start)] ${
                        item.level === 3 ? "ml-3 text-[var(--text-secondary)]" : "font-semibold text-[var(--text-primary)]"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </section>
            )}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(2,6,23,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Share</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {shareLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-200 bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] transition-colors duration-200 hover:bg-slate-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href={postUrl}
                className="mt-4 block break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-[var(--text-secondary)]"
              >
                {postUrl}
              </a>
            </section>

            {post.author && (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(2,6,23,0.45)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Author</p>
                <div className="mt-4 flex items-center gap-3">
                  {authorImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={authorImageUrl} alt={post.author.name || "Author"} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)] text-lg font-bold text-[var(--text-primary)]">
                      {(post.author.name || "S").charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-bold text-[var(--text-primary)]">{post.author.name || "Sadi"}</p>
                    <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Contributor</p>
                  </div>
                </div>

                {post.author.bio && (
                  <div className="mt-4 prose prose-sm max-w-none prose-p:text-[var(--text-secondary)]">
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
                        className="rounded-full border border-slate-200 bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] transition-colors duration-200 hover:bg-slate-200"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(2,6,23,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Filed Under</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories?.length ? (
                  post.categories.map((category) => (
                    <Link
                      key={category.slug.current}
                      href={`/category/${category.slug.current}`}
                      className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] transition-colors duration-200 hover:bg-slate-200"
                    >
                      {category.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">No categories listed.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </>
  )
}
