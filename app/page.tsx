import { client } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/image'

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

async function getData() {
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
}

export default async function Home() {
  const data = await getData()
  const categorySections = [
    {
      title: "Politics",
      href: "/category/politics",
      posts: data.politics,
      shell: "bg-[linear-gradient(140deg,rgba(79,70,229,0.11),rgba(167,139,250,0.08))]",
      badge: "bg-[var(--primary-start)]/10 text-[var(--primary-start)]",
      line: "from-[var(--primary-start)] to-[var(--accent)]",
    },
    {
      title: "Tech",
      href: "/category/tech",
      posts: data.tech,
      shell: "bg-[linear-gradient(140deg,rgba(6,182,212,0.12),rgba(79,70,229,0.08))]",
      badge: "bg-cyan-500/10 text-cyan-700",
      line: "from-[var(--primary-end)] to-[var(--primary-start)]",
    },
    {
      title: "Islamic",
      href: "/category/islam",
      posts: data.islam,
      shell: "bg-[linear-gradient(140deg,rgba(167,139,250,0.16),rgba(6,182,212,0.08))]",
      badge: "bg-[var(--accent)]/20 text-violet-700",
      line: "from-[var(--accent)] to-[var(--primary-end)]",
    },
  ]
  const latestImageUrl = getFeaturedImageUrl(data.latest, 1500, 860)
  const leadCategoryPost = categorySections[0]?.posts[0]
  const leadCategoryImageUrl = getFeaturedImageUrl(leadCategoryPost, 1200, 700)

  return (
    <>
      <section className="relative isolate w-full overflow-hidden bg-[#0b1220] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(79,70,229,0.55),transparent_42%),radial-gradient(circle_at_85%_5%,rgba(6,182,212,0.38),transparent_36%),linear-gradient(120deg,#0b1220_0%,#111827_45%,#0f172a_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(241,245,249,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,245,249,0.16)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b1220] to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90 backdrop-blur-sm">
              Personal Journal
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] md:text-6xl">
              Mohammad Sadi
              <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-[var(--primary-end)] bg-clip-text text-transparent">
                Ideas with Depth
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
              Political commentary, technology insight, Islamic reflection, and bold opinions crafted for readers who
              want clarity over noise.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#newsletter"
                className="rounded-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Join Newsletter
              </Link>
              <Link
                href="/category/opinion"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
              >
                Read Opinion
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[var(--primary-start)]/45 via-[var(--accent)]/30 to-[var(--primary-end)]/45 blur-2xl" />
              <div className="absolute -left-5 -top-5 h-16 w-16 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md" />
              <div className="absolute -bottom-5 -right-5 h-20 w-20 rounded-[1.25rem] border border-white/30 bg-white/10 backdrop-blur-md" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm shadow-2xl shadow-black/35">
                <Image
                  src="/profile.jpeg"
                  alt="Mohammad Sadi hero portrait"
                  width={640}
                  height={640}
                  priority
                  className="h-auto w-full rounded-[1.35rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen w-full overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 z-0 opacity-80 [background-image:linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] [background-size:20px_20px] [mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] [mask-composite:intersect] [-webkit-mask-composite:source-in]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-[#0b1220]/10 to-transparent" />

        <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-6 py-14 md:py-16">
          {data.latest && (
            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <Link
                href={`/post/${data.latest.slug.current}`}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_20px_55px_-28px_rgba(2,6,23,0.35)] transition-transform duration-300 hover:-translate-y-1"
              >
                {latestImageUrl && (
                  <figure className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={latestImageUrl} alt={getFeaturedImageAlt(data.latest)} className="h-auto w-full object-cover" />
                  </figure>
                )}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent)]/25 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)]" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Featured Story
                </p>
                <h2 className="relative mt-4 text-3xl font-black leading-tight text-[var(--text-primary)] md:text-4xl">
                  {data.latest.title}
                </h2>
                <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-start)]">
                  Read article
                  <span className="transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
                </div>
              </Link>

              <aside className="rounded-[1.75rem] border border-slate-200 bg-[var(--surface)]/75 p-6 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.35)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Quick Navigation
                </p>
                <h3 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Explore Categories</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Jump directly into the topics you care about most.
                </p>
                <div className="mt-6 grid gap-3">
                  {categorySections.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-center justify-between rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:bg-slate-50"
                    >
                      {item.title}
                      <span className="text-[var(--text-secondary)] transition-transform duration-200 group-hover:translate-x-1">
                        -&gt;
                      </span>
                    </Link>
                  ))}
                </div>
              </aside>
            </section>
          )}

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[var(--text-primary)] md:text-3xl">Recent Posts</h2>
              <Link
                href="/category/tech"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--surface)]"
              >
                View More
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.posts?.map((post, index) => {
                const postImageUrl = getFeaturedImageUrl(post, 900, 540)

                return (
                  <Link
                    key={post.slug.current}
                    href={`/post/${post.slug.current}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_-28px_rgba(2,6,23,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_-28px_rgba(79,70,229,0.45)]"
                  >
                    {postImageUrl && (
                      <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={postImageUrl} alt={getFeaturedImageAlt(post)} className="h-auto w-full object-cover" />
                      </figure>
                    )}
                    <div className="absolute right-3 top-3 rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-secondary)]">
                      #{String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-[var(--text-primary)]">
                      {post.title}
                    </h3>
                    <p className="mt-4 text-sm text-[var(--text-secondary)]">Tap to read the full analysis.</p>
                    <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] transition-all duration-300 group-hover:w-40" />
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Magazine Desk</p>
                <h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">Category Edition</h2>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Weekly Selection</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <article className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(2,6,23,0.5)] lg:col-span-7">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--primary-start)] via-[var(--accent)] to-[var(--primary-end)]" />
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[var(--primary-start)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-start)]">
                    {categorySections[0].title}
                  </span>
                  <Link
                    href={categorySections[0].href}
                    className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--primary-start)]"
                  >
                    View All
                  </Link>
                </div>

                {leadCategoryPost ? (
                  <>
                    <Link
                      href={`/post/${leadCategoryPost.slug.current}`}
                      className="group mt-5 block border-b border-slate-200 pb-6"
                    >
                      {leadCategoryImageUrl && (
                        <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={leadCategoryImageUrl}
                            alt={getFeaturedImageAlt(leadCategoryPost)}
                            className="h-auto w-full object-cover"
                          />
                        </figure>
                      )}
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Lead Analysis</p>
                      <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary-start)] md:text-4xl">
                        {leadCategoryPost.title}
                      </h3>
                    </Link>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {categorySections[0].posts.slice(1, 5).map((post, idx) => (
                        <Link
                          key={post.slug.current}
                          href={`/post/${post.slug.current}`}
                          className="group rounded-xl border border-slate-200 bg-[var(--surface)]/45 px-4 py-3 transition-colors duration-200 hover:bg-[var(--surface)]"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                            Column {idx + 2}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary-start)]">
                            {post.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-[var(--surface)]/55 px-4 py-5 text-sm text-[var(--text-secondary)]">
                    No posts available in this category yet.
                  </div>
                )}
              </article>

              <div className="space-y-6 lg:col-span-5">
                {categorySections.slice(1).map((section) => {
                  const sectionLead = section.posts[0]
                  const sectionLeadImageUrl = getFeaturedImageUrl(sectionLead, 900, 520)

                  return (
                    <article
                      key={section.title}
                      className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_-30px_rgba(2,6,23,0.45)]"
                    >
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${section.line}`} />
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${section.badge}`}>
                          {section.title}
                        </span>
                        <Link
                          href={section.href}
                          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--primary-start)]"
                        >
                          View All
                        </Link>
                      </div>

                      {sectionLead ? (
                        <>
                          <Link
                            href={`/post/${sectionLead.slug.current}`}
                            className="group mt-4 block border-b border-slate-200 pb-4"
                          >
                            {sectionLeadImageUrl && (
                              <figure className="mb-3 overflow-hidden rounded-lg border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={sectionLeadImageUrl}
                                  alt={getFeaturedImageAlt(sectionLead)}
                                  className="h-auto w-full object-cover"
                                />
                              </figure>
                            )}
                            <h3 className="font-serif text-2xl font-bold leading-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary-start)]">
                              {sectionLead.title}
                            </h3>
                          </Link>

                          <div className="mt-3 space-y-2">
                            {section.posts.slice(1, 4).map((post, idx) => (
                              <Link
                                key={post.slug.current}
                                href={`/post/${post.slug.current}`}
                                className="group flex items-start gap-3 rounded-lg px-1.5 py-2 transition-colors duration-200 hover:bg-[var(--surface)]/45"
                              >
                                <span className="mt-0.5 min-w-[26px] text-[11px] font-bold text-[var(--text-secondary)]">
                                  0{idx + 2}
                                </span>
                                <p className="text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary-start)]">
                                  {post.title}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="mt-4 rounded-lg border border-slate-200 bg-[var(--surface)]/55 px-4 py-4 text-sm text-[var(--text-secondary)]">
                          No posts available in this category yet.
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
      </section>
    </>
  )
}
