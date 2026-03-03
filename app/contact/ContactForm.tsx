"use client"

import { useState, useRef } from "react"
import { Check, ArrowRight, Loader2 } from "lucide-react"

type FormState = "idle" | "submitting" | "success" | "error"

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("submitting")
    setErrorMsg("")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error((json as { error?: string }).error ?? "Failed to send")
      }

      setState("success")
      formRef.current?.reset()
    } catch (err) {
      setState("error")
      setErrorMsg(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Something went wrong. Please try again or email me directly."
      )
    }
  }

  if (state === "success") {
    return (
      <div className="flex min-h-[480px] flex-col items-start justify-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
          <Check className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Message sent</p>
        <h2 className="mt-2 text-4xl font-extrabold text-foreground">Got it. Thank you.</h2>
        <p className="mt-4 max-w-sm text-muted-foreground">I read every message personally and will get back to you as soon as I can.</p>
        <button
          onClick={() => setState("idle")}
          className="mt-8 inline-flex h-10 items-center rounded-md border border-border px-6 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Send another
        </button>
      </div>
    )
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Full name <span className="text-foreground">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Email <span className="text-foreground">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Subject <span className="text-foreground">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What is this about?"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Message <span className="text-foreground">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder="Your message..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {state === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex h-11 items-center gap-3 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send message
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  )
}
