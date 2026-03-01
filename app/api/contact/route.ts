import { NextRequest, NextResponse } from "next/server"

type ContactPayload = {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
}

// Rate limiting: simple in-memory store (resets on cold start)
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  let body: ContactPayload
  try {
    body = (await req.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { name, email, subject, message } = body

  // Validate required fields
  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof subject !== "string" || !subject.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 422 })
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 })
  }

  // Length guards
  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Input too long." }, { status: 422 })
  }

  // ── Send email ──────────────────────────────────────────────────────────────
  // To wire up email delivery, install nodemailer and configure SMTP env vars:
  //   CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER,
  //   CONTACT_SMTP_PASS, CONTACT_TO_EMAIL
  //
  // Example (uncomment when ready):
  //
  // import nodemailer from "nodemailer"
  // const transporter = nodemailer.createTransport({
  //   host: process.env.CONTACT_SMTP_HOST,
  //   port: Number(process.env.CONTACT_SMTP_PORT ?? 587),
  //   auth: { user: process.env.CONTACT_SMTP_USER, pass: process.env.CONTACT_SMTP_PASS },
  // })
  // await transporter.sendMail({
  //   from: `"${name}" <${process.env.CONTACT_SMTP_USER}>`,
  //   replyTo: email,
  //   to: process.env.CONTACT_TO_EMAIL,
  //   subject: `[Contact] ${subject}`,
  //   text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  // })
  // ────────────────────────────────────────────────────────────────────────────

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[contact]", { name, email, subject, message: message.slice(0, 100) })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
