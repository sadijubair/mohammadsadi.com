import { client } from "@/lib/sanity"
import Link from "next/link"
import { urlFor } from "@/lib/image"

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

type CategoryTheme = {
  label: string
  description: string
  badgeClass: string
  lineClass: string
  haloClass: string
}

const categoryThemes: Record<string, CategoryTheme> = {
  politics: {
    label: "Politics",
    description: "Policy, power, and public direction through clear editorial analysis.",
    badgeClass: "bg-[var(--primary-start)]/15 text-[var(--primary-start)]",
    lineClass: "from-[var(--primary-start)] via-[var(--accent)] to-[var(--primary-end)]",
    haloClass: "bg-[var(--primary-start)]/30",
  },
  tech: {
    label: "Tech",
    description: "Software, platforms, and internet shifts explained with practical context.",
    badgeClass: "bg-cyan-500/15 text-cyan-700",
    lineClass: "from-[var(--primary-end)] via-cyan-400 to-[var(--primary-start)]",
    haloClass: "bg-cyan-500/30",
  },
  islam: {
    label: "Islamic",
    description: "Faith-centered reflections, values, and thoughtful discussions for modern life.",
    badgeClass: "bg-[var(--accent)]/20 text-violet-700",
    lineClass: "from-[var(--accent)] via-violet-400 to-[var(--primary-end)]",
    haloClass: "bg-[var(--accent)]/30",
  },
  opinion: {
    label: "Opinion",
    description: "Independent viewpoints on current issues, culture, and society.",
    badgeClass: "bg-slate-900/10 text-slate-700",
    lineClass: "from-slate-600 via-[var(--primary-start)] to-[var(--primary-end)]",
    haloClass: "bg-slate-500/25",
  },
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

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ")

async function getPostsByCategory(slug: string) {
  return await client.fetch<Post[]>(
    `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
      title,
      slug,
      publishedAt,
      "featuredImage": coalesce(featuredImage, mainImage, coverImage, heroImage, image)
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

  const theme = categoryThemes[slug] ?? {
    label: titleFromSlug(slug),
    description: "Selected writing and analysis from this category.",
    badgeClass: "bg-slate-900/10 text-slate-700",
    lineClass: "from-[var(--primary-start)] via-[var(--accent)] to-[var(--primary-end)]",
    haloClass: "bg-[var(--primary-start)]/25",
  }

  const leadPost = posts[0]
  const leadImageUrl = getFeaturedImageUrl(leadPost, 1500, 850)
  const headlinePosts = posts.slice(1, 5)
  const archivePosts = posts.slice(5)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b1220] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(79,70,229,0.5),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.35),transparent_38%),linear-gradient(120deg,#0b1220_0%,#111827_45%,#0f172a_100%)]" />
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(to_right,rgba(241,245,249,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,245,249,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className={`absolute -right-16 top-12 h-44 w-44 rounded-full blur-3xl ${theme.haloClass}`} />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-100 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
            >
              Home
            </Link>
            <span className="text-sm text-slate-300">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{theme.label}</span>
          </div>

          <p className={`mt-6 inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${theme.badgeClass}`}>
            Category Edition
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-6xl">{theme.label}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">{theme.description}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
            {posts.length} article{posts.length === 1 ? "" : "s"} available
          </p>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 z-0 opacity-80 [background-image:linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] [background-size:20px_20px] [mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [mask-composite:intersect] [-webkit-mask-composite:source-in]" />

        <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-12 md:py-14">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_16px_38px_-30px_rgba(2,6,23,0.4)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">No posts found</h2>
              <p className="mt-3 text-[var(--text-secondary)]">New posts in this category will appear here.</p>
            </div>
          ) : (
            <>
              {leadPost && (
                <section className="grid gap-6 lg:grid-cols-12">
                  <Link
                    href={`/post/${leadPost.slug.current}`}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_20px_48px_-30px_rgba(2,6,23,0.45)] transition-transform duration-300 hover:-translate-y-1 lg:col-span-8"
                  >
                    {leadImageUrl && (
                      <figure className="mb-5 overflow-hidden rounded-2xl border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={leadImageUrl} alt={getFeaturedImageAlt(leadPost)} className="h-auto w-full object-cover" />
                      </figure>
                    )}
                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.lineClass}`} />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Lead Story</p>
                    <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
                      {leadPost.title}
                    </h2>
                    <div className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--primary-start)]">
                      {formatDate(leadPost.publishedAt)}
                      <span className="h-1 w-1 rounded-full bg-[var(--text-secondary)]" />
                      <span>Read full article</span>
                    </div>
                  </Link>

                  <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_42px_-30px_rgba(2,6,23,0.45)] lg:col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Headlines</p>
                    <div className="mt-4 space-y-3">
                      {headlinePosts.length > 0 ? (
                        headlinePosts.map((post, index) => {
                          const headlineImageUrl = getFeaturedImageUrl(post, 520, 320)

                          return (
                            <Link
                              key={post.slug.current}
                              href={`/post/${post.slug.current}`}
                              className="group flex items-start gap-3 rounded-lg border border-slate-100 bg-[var(--surface)]/45 px-3 py-3 transition-colors duration-200 hover:bg-[var(--surface)]"
                            >
                              <span className="mt-0.5 min-w-[26px] text-[11px] font-bold text-[var(--text-secondary)]">
                                0{index + 2}
                              </span>
                              {headlineImageUrl && (
                                <figure className="mt-0.5 h-14 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={headlineImageUrl}
                                    alt={getFeaturedImageAlt(post)}
                                    className="h-full w-full object-cover"
                                  />
                                </figure>
                              )}
                              <p className="text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary-start)]">
                                {post.title}
                              </p>
                            </Link>
                          )
                        })
                      ) : (
                        <div className="rounded-lg border border-slate-100 bg-[var(--surface)]/45 px-3 py-4 text-sm text-[var(--text-secondary)]">
                          More headlines coming soon.
                        </div>
                      )}
                    </div>
                  </aside>
                </section>
              )}

              {archivePosts.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <h3 className="text-2xl font-black text-[var(--text-primary)]">Archive</h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Earlier stories
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {archivePosts.map((post, index) => {
                      const archiveImageUrl = getFeaturedImageUrl(post, 900, 540)

                      return (
                        <Link
                          key={post.slug.current}
                          href={`/post/${post.slug.current}`}
                          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(2,6,23,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {archiveImageUrl && (
                            <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={archiveImageUrl} alt={getFeaturedImageAlt(post)} className="h-auto w-full object-cover" />
                            </figure>
                          )}
                          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.lineClass}`} />
                          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                            Story {index + 6}
                          </span>
                          <h4 className="mt-2 text-lg font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary-start)]">
                            {post.title}
                          </h4>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                            {formatDate(post.publishedAt)}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </section>
    </>
  )
}
