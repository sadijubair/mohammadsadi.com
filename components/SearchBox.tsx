"use client"

import Link from "next/link"
import { useCallback, useId, useRef, useState } from "react"
import { Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type SearchResult = {
  title: string
  slug: string
}

export default function SearchBox({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listboxId = useId()

  const search = useCallback((q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); setOpen(false); setLoading(false); return }
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

  const close = () => { setQuery(""); setResults([]); setOpen(false) }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close()
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
  }

  const isExpanded = open && results.length > 0

  return (
    <div className={cn("relative w-full", className)} onBlur={handleBlur}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
        className="block w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors"
      />

      {isExpanded && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-[100] mt-1.5 overflow-hidden rounded-md border border-border bg-popover shadow-lg"
        >
          <div className="max-h-64 overflow-y-auto p-1">
            {results.map((r) => (
              <li key={r.slug} role="option" aria-selected={false}>
                <Link
                  href={`/post/${r.slug}`}
                  onClick={close}
                  className="block rounded-sm px-3 py-2.5 text-sm font-medium text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
