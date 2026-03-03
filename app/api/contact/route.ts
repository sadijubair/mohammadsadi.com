import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

  // ── Send email via SMTP (nodemailer) ────────────────────────────────────────
  const smtpHost = process.env.CONTACT_SMTP_HOST
  const smtpUser = process.env.CONTACT_SMTP_USER
  const smtpPass = process.env.CONTACT_SMTP_PASS
  const toEmail  = process.env.CONTACT_TO_EMAIL

  if (smtpHost && smtpUser && smtpPass && toEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.CONTACT_SMTP_PORT ?? 587),
        secure: Number(process.env.CONTACT_SMTP_PORT ?? 587) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })

      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        replyTo: `"${name}" <${email}>`,
        to: toEmail,
        subject: `[Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `
          <table style="font-family:sans-serif;font-size:14px;color:#111;width:100%;max-width:560px">
            <tr><td style="padding:24px 0 8px">
              <h2 style="margin:0;font-size:20px">New contact message</h2>
            </td></tr>
            <tr><td style="padding:4px 0"><strong>Name:</strong> ${name}</td></tr>
            <tr><td style="padding:4px 0"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:4px 0"><strong>Subject:</strong> ${subject}</td></tr>
            <tr><td style="padding:16px 0 0">
              <strong>Message:</strong>
              <p style="margin:8px 0 0;white-space:pre-wrap;line-height:1.6">${message}</p>
            </td></tr>
          </table>`,
      })
    } catch (err) {
      console.error("[contact] SMTP send failed:", err)
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }
  } else {
    // Log to console when SMTP is not configured (dev / preview)
    console.log("[contact] SMTP not configured — would have sent:", {
      name, email, subject, message: message.slice(0, 100),
    })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
