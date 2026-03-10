export type CategoryMeta = {
  slug: string
  label: string
  href: string
  description: string
  badgeClass: string
  lineClass: string
  haloClass: string
  /** Tailwind shell used on the homepage magazine section */
  shell: string
  /** Tailwind gradient classes for the homepage section heading line */
  line: string
  /** Tailwind badge classes for the homepage section badge */
  badge: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "technology",
    label: "Technology",
    href: "/category/technology",
    description: "Software, platforms, and internet shifts explained with practical context.",
    badgeClass: "bg-zinc-100 text-zinc-900",
    lineClass: "from-black to-zinc-500",
    haloClass: "bg-white/10",
    shell: "bg-zinc-50",
    line: "from-black to-zinc-500",
    badge: "bg-zinc-100 text-zinc-900",
  },
  {
    slug: "education",
    label: "Education",
    href: "/category/education",
    description: "Learning, knowledge, and ideas that shape how we grow and think.",
    badgeClass: "bg-zinc-100 text-zinc-900",
    lineClass: "from-black to-zinc-500",
    haloClass: "bg-white/10",
    shell: "bg-zinc-50",
    line: "from-black to-zinc-500",
    badge: "bg-zinc-100 text-zinc-900",
  },
  {
    slug: "politics",
    label: "Politics",
    href: "/category/politics",
    description: "Policy, power, and public direction through clear editorial analysis.",
    badgeClass: "bg-zinc-100 text-zinc-900",
    lineClass: "from-black to-zinc-500",
    haloClass: "bg-white/10",
    shell: "bg-zinc-50",
    line: "from-black to-zinc-500",
    badge: "bg-zinc-100 text-zinc-900",
  },
  {
    slug: "opinion",
    label: "Opinion",
    href: "/category/opinion",
    description: "Independent viewpoints on current issues, culture, and society.",
    badgeClass: "bg-zinc-100 text-zinc-900",
    lineClass: "from-black to-zinc-500",
    haloClass: "bg-white/10",
    shell: "bg-zinc-50",
    line: "from-black to-zinc-500",
    badge: "bg-zinc-100 text-zinc-900",
  },
]

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)

export function getCategoryMeta(slug: string): CategoryMeta {
  return (
    CATEGORIES.find((c) => c.slug === slug) ?? {
      slug,
      label: slug
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" "),
      href: `/category/${slug}`,
      description: "Selected writing and analysis from this category.",
      badgeClass: "bg-zinc-100 text-zinc-900",
      lineClass: "from-black to-zinc-500",
      haloClass: "bg-white/10",
      shell: "bg-zinc-50",
      line: "from-black to-zinc-500",
      badge: "bg-zinc-100 text-zinc-900",
    }
  )
}
