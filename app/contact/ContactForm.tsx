"use client"

import { useState, useRef } from "react"

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

      if (!res.ok) throw new Error("Failed to send")

      setState("success")
      formRef.current?.reset()
    } catch {
      setState("error")
      setErrorMsg("Something went wrong. Please try again or email me directly.")
    }
  }

  if (state === "success") {
    return (
      <div className="flex min-h-[480px] flex-col items-start justify-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center bg-zinc-950">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Message sent</p>
        <h2 className="mt-2 font-serif text-4xl font-black text-zinc-950">Got it. Thank you.</h2>
        <p className="mt-4 max-w-sm text-zinc-500">I read every message personally and will get back to you as soon as I can.</p>
        <button
          onClick={() => setState("idle")}
          className="mt-8 border border-zinc-200 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
        >
          Send another
        </button>
      </div>
    )
  }

  const inputClass =
    "w-full border border-zinc-200 bg-white px-4 py-3 text-[0.95rem] text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-zinc-950"

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Full name <span className="text-zinc-950">*</span>
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
          <label htmlFor="email" className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Email <span className="text-zinc-950">*</span>
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
        <label htmlFor="subject" className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Subject <span className="text-zinc-950">*</span>
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
        <label htmlFor="message" className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Message <span className="text-zinc-950">*</span>
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
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="flex items-center gap-3 bg-zinc-950 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.45em] text-white transition-all hover:bg-zinc-700 disabled:opacity-50"
      >
        {state === "submitting" ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending
          </>
        ) : (
          <>
            Send message
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
