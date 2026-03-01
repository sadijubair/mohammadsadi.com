"use client"

import Link from "next/link"
import { useCallback, useId, useRef, useState } from "react"

type SearchResult = {
  title: string
  slug: string
}

export default function SearchBox({ dark = false }: { dark?: boolean }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listboxId = useId()

  const search = useCallback((q: string) => {
    setQuery(q)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!q.trim()) {
      setResults([])
      setOpen(false)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        if (res.ok) {
          const data: SearchResult[] = await res.json()
          setResults(data)
          setOpen(data.length > 0)
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)
  }, [])

  const close = () => {
    setQuery("")
    setResults([])
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close()
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Close only when focus leaves the entire widget
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false)
    }
  }

  const isExpanded = open && results.length > 0

  return (
    <div className="relative w-full" onBlur={handleBlur}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        {loading ? (
          <svg
            className={`h-4 w-4 animate-spin ${dark ? "text-zinc-300" : "text-[var(--primary-start)]"}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg
            className={`h-4 w-4 ${dark ? "text-zinc-400" : "text-[var(--text-secondary)]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      <input
        type="search"
        role="combobox"
        aria-label="Search articles"
        aria-autocomplete="list"
        aria-expanded={isExpanded}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => search(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`block w-full rounded-full border py-2.5 pl-10 pr-4 text-sm transition-all duration-200 focus:outline-none ${dark ? "border-white/10 bg-white/10 text-white placeholder:text-zinc-400 focus:border-white/30 focus:bg-white/15" : "border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/80 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/20"}`}
      />

      {isExpanded && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className={`absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden border shadow-2xl ${dark ? "border-white/10 bg-zinc-900" : "rounded-2xl border-[var(--surface)] bg-white shadow-slate-200/70"}`}
        >
          <div className="max-h-64 space-y-1 overflow-y-auto p-2">
            {results.map((r) => (
              <li key={r.slug} role="option" aria-selected={false}>
                <Link
                  href={`/post/${r.slug}`}
                  onClick={close}
                  className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${dark ? "text-zinc-100 hover:bg-white/10 hover:text-white" : "rounded-xl text-[var(--text-primary)] hover:bg-[var(--surface)] hover:text-[var(--primary-start)]"}`}
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  )
}
