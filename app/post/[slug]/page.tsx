import { client } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
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

  const authorLinks = [
    { label: "Website", href: post.author?.website },
    { label: "Twitter", href: post.author?.twitter },
    { label: "Facebook", href: post.author?.facebook },
    { label: "GitHub", href: post.author?.github },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))

  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(120).height(120).url() : null
  const featuredImageUrl = post.featuredImage ? urlFor(post.featuredImage).width(1800).height(1000).url() : null
  const featuredImageAlt = post.featuredImage?.alt || post.title

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

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(2,6,23,0.5)] md:p-10">
            {featuredImageUrl && (
              <figure className="mb-8 overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImageUrl} alt={featuredImageAlt} className="h-auto w-full object-cover" />
              </figure>
            )}

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--primary-start)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--text-primary)] prose-blockquote:border-l-[var(--accent)] prose-blockquote:bg-[var(--surface)]/45 prose-blockquote:px-4 prose-blockquote:py-2 prose-ul:marker:text-[var(--primary-start)]">
              <PortableText value={post.body ?? []} />
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
