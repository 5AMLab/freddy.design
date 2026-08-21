import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/site";

const DELIVERABLES = [
  "A presentation deck",
  "Brand & campaign work",
  "E-commerce assets",
  "Print & collateral",
  "Something else",
];

const TIMELINES = ["Within 48 hours", "This week", "This month", "Just exploring"];

// Sender address must live on a domain verified in Resend.
const FROM_ADDRESS = "Studio Kavea <hello@kavea.studio>";

// Verifies a Cloudflare Turnstile token server-side. Never trust a token
// that only passed a client-side check — that's just JS, any bot can skip it.
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // captcha not configured — don't block submissions

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification request failed", err);
    return false;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { deliverable, timeline, note, name, email, company, turnstileToken } =
    (payload ?? {}) as Record<string, unknown>;

  // Honeypot: a real visitor never fills this field. Pretend success so a
  // bot doesn't learn its submission was rejected.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return NextResponse.json({ error: "Please complete the verification check." }, { status: 400 });
    }
    const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const human = await verifyTurnstile(turnstileToken, remoteIp);
    if (!human) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
    }
  }

  if (
    typeof deliverable !== "string" ||
    typeof timeline !== "string" ||
    typeof note !== "string" ||
    !DELIVERABLES.includes(deliverable) ||
    !TIMELINES.includes(timeline) ||
    !note.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const cleanName = typeof name === "string" ? name.trim().slice(0, 200) : "";
  const cleanEmail = typeof email === "string" ? email.trim().slice(0, 200) : "";
  const cleanNote = note.trim().slice(0, 4000);

  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

  try {
    // Notify the studio inbox.
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_EMAIL,
      replyTo: cleanEmail || undefined,
      subject: `New brief — ${deliverable}`,
      text: [
        `What they need: ${deliverable}`,
        `Timeline: ${timeline}`,
        "",
        cleanNote,
        "",
        cleanName ? `From: ${cleanName}` : "From: (name not given)",
        cleanEmail ? `Email: ${cleanEmail}` : "Email: (not given)",
      ].join("\n"),
    });

    // Auto-reply to the customer, only if they gave an email.
    if (cleanEmail) {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: cleanEmail,
        replyTo: CONTACT_EMAIL,
        subject: "We've got your brief",
        text: [
          cleanName ? `Hi ${cleanName},` : "Hi,",
          "",
          "Thanks for reaching out — your brief has landed in our inbox and we'll be in touch shortly.",
          "",
          "For reference, here's what you sent us:",
          `— ${deliverable}, ${timeline.toLowerCase()}`,
          `“${cleanNote}”`,
          "",
          "Talk soon,",
          "Studio Kavea",
        ].join("\n"),
        html: [
          `<p>${cleanName ? `Hi ${escapeHtml(cleanName)},` : "Hi,"}</p>`,
          `<p>Thanks for reaching out — your brief has landed in our inbox and we'll be in touch shortly.</p>`,
          `<p>For reference, here's what you sent us:</p>`,
          `<p>— ${escapeHtml(deliverable)}, ${escapeHtml(timeline.toLowerCase())}<br/>“${escapeHtml(cleanNote)}”</p>`,
          `<p>Talk soon,<br/>Studio Kavea</p>`,
        ].join(""),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send brief email", err);
    return NextResponse.json({ error: "Couldn't send your brief. Please try again." }, { status: 502 });
  }
}
