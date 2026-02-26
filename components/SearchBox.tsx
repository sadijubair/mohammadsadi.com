"use client"

import Link from "next/link"
import { useState } from "react"

type SearchResult = {
  title: string
  slug: string
}

export default function SearchBox() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  const search = async (q: string) => {
    setQuery(q)

    if (!q.trim()) {
      setResults([])
      return
    }

    const res = await fetch(`/api/search?q=${q}`)
    const data = await res.json()
    setResults(data)
  }

  const handleLinkClick = () => {
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg
          className="h-4 w-4 text-[var(--text-secondary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => search(e.target.value)}
        className="block w-full rounded-full border border-transparent bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/80 transition-all duration-200 focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
      />

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--surface)] bg-white shadow-2xl shadow-slate-200/70">
          <div className="max-h-64 space-y-1 overflow-y-auto p-2">
            {results.map((r) => (
              <Link
                key={r.slug}
                href={`/post/${r.slug}`}
                onClick={handleLinkClick}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--surface)] hover:text-[var(--primary-start)]"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
