"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { RETAINER_SLOTS } from "@/lib/site";

export const OPEN_BRIEF_EVENT = "fd:open-brief";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export function openBrief() {
  window.dispatchEvent(new Event(OPEN_BRIEF_EVENT));
}

const DELIVERABLES = [
  "A presentation deck",
  "Brand & campaign work",
  "E-commerce assets",
  "Print & collateral",
  "Something else",
];

const TIMELINES = [
  "Within 48 hours",
  "This week",
  "This month",
  "Just exploring",
];

const QUESTIONS = ["What do you need?", "When do you need it?", "Tell me the gist."];

export default function BriefFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [deliverable, setDeliverable] = useState("");
  const [timeline, setTimeline] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Honeypot: real visitors never see or fill this field (off-screen, no
  // label). Bots that blindly fill every input trip it; checked server-side.
  const [company, setCompany] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);

  const close = useCallback(() => setOpen(false), []);

  // open on demand, reset to a fresh flow each time
  useEffect(() => {
    const onOpen = () => {
      setStep(0);
      setDeliverable("");
      setTimeline("");
      setNote("");
      setName("");
      setEmail("");
      setCompany("");
      setTurnstileToken("");
      setStatus("idle");
      setErrorMessage("");
      setOpen(true);
    };
    window.addEventListener(OPEN_BRIEF_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_BRIEF_EVENT, onOpen);
  }, []);

  // esc to close + body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // panel entrance + step transitions (fade-up, MOTION.md)
  useEffect(() => {
    if (!open || prefersReducedMotion() || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [open]);

  useEffect(() => {
    if (!open || prefersReducedMotion() || !stepRef.current) return;
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
    );
  }, [step, open]);

  // Mount the Turnstile widget once the review step is reached and the
  // script has loaded — not earlier, so it never renders for people who
  // close the flow before getting there.
  useEffect(() => {
    if (!open || step !== 3 || status === "sent") return;
    if (!turnstileReady || !turnstileRef.current || !TURNSTILE_SITE_KEY) return;
    if (turnstileWidgetId.current) return;
    turnstileWidgetId.current = window.turnstile?.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "dark",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [open, step, status, turnstileReady]);

  // Drop the widget when the flow closes so a stale token/id can't linger
  // into the next open.
  useEffect(() => {
    if (open) return;
    if (turnstileWidgetId.current) {
      window.turnstile?.remove(turnstileWidgetId.current);
      turnstileWidgetId.current = undefined;
    }
  }, [open]);

  if (!open) return null;

  const submitBrief = async () => {
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliverable,
          timeline,
          note: note.trim(),
          name: name.trim(),
          email: email.trim(),
          company, // honeypot — should always be empty
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const pick = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setStep((s) => s + 1);
  };

  const optionRow = (value: string, onPick: (v: string) => void) => (
    <button
      key={value}
      onClick={() => onPick(value)}
      className="brief-option"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        borderBottom: "1px solid rgba(249,249,249,0.12)",
        padding: "22px 0",
        cursor: "pointer",
        fontFamily: "var(--font-body), sans-serif",
        fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
        fontWeight: 500,
        color: "var(--off-white)",
      }}
    >
      {value}
      <span className="brief-option-arrow" aria-hidden>
        {" "}
        →
      </span>
    </button>
  );

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Brief me"
      data-lenis-prevent
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        background: "rgba(5,5,5,0.98)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 5vw, 72px)",
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "clamp(40px, 8vh, 96px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--orange)",
            }}
          >
            Brief Me{" "}
            <span style={{ color: "rgba(249,249,249,0.3)", marginLeft: "12px" }}>
              {String(Math.min(step + 1, 4)).padStart(2, "0")} / 04
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              background: "none",
              border: "1px solid rgba(var(--orange-rgb), 0.35)",
              borderRadius: "8px",
              color: "rgba(249,249,249,0.7)",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            Close · Esc
          </button>
        </div>

        {/* Step body */}
        <div ref={stepRef} style={{ flex: 1 }}>
          {step <= 2 && (
            <h2
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(1.7rem, 3.4vw, 2.8rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                textTransform: "uppercase",
                color: "var(--off-white)",
                marginBottom: "clamp(28px, 5vh, 56px)",
              }}
            >
              {QUESTIONS[step]}
              {step === 2 && (
                <span
                  style={{
                    display: "block",
                    fontSize: "1.05rem",
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 400,
                    textTransform: "none",
                    color: "rgba(249,249,249,0.5)",
                    marginTop: "16px",
                    lineHeight: 1.7,
                  }}
                >
                  One rough line is plenty — voice-note energy, written down.
                </span>
              )}
            </h2>
          )}

          {step === 0 && (
            <div style={{ borderTop: "1px solid rgba(249,249,249,0.12)" }}>
              {DELIVERABLES.map((d) => optionRow(d, pick(setDeliverable)))}
            </div>
          )}

          {step === 1 && (
            <div style={{ borderTop: "1px solid rgba(249,249,249,0.12)" }}>
              {TIMELINES.map((t) => optionRow(t, pick(setTimeline)))}
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Honeypot — hidden from sighted and screen-reader users alike,
                  left unlabeled so autofill won't touch it either. Any bot
                  that fills every field trips this. */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              />
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Board deck for our Q3 review — 20 slides, existing template, need it polished…"
                rows={4}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(var(--orange-rgb), 0.35)",
                  outline: "none",
                  resize: "vertical",
                  padding: "8px 0 16px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "clamp(1.15rem, 1.9vw, 1.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "var(--off-white)",
                }}
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name / company (optional)"
                style={{
                  width: "100%",
                  marginTop: "28px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(249,249,249,0.15)",
                  outline: "none",
                  padding: "8px 0 12px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "rgba(249,249,249,0.8)",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email — so we can reply"
                style={{
                  width: "100%",
                  marginTop: "16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(249,249,249,0.15)",
                  outline: "none",
                  padding: "8px 0 12px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "rgba(249,249,249,0.8)",
                }}
              />
              <button
                onClick={() => setStep(3)}
                disabled={!note.trim() || !email.trim()}
                style={{
                  marginTop: "40px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--off-white)",
                  background: note.trim() && email.trim() ? "var(--orange)" : "rgba(var(--orange-rgb), 0.25)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px 36px",
                  cursor: note.trim() && email.trim() ? "pointer" : "not-allowed",
                  transition: "background 0.3s",
                }}
              >
                Review brief →
              </button>
            </div>
          )}

          {step === 3 && status === "sent" && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: "24px",
                }}
              >
                Sent
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(1.7rem, 3.4vw, 2.8rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  color: "var(--off-white)",
                  marginBottom: "20px",
                }}
              >
                Got it{name.trim() ? `, ${name.trim()}` : ""}.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "rgba(249,249,249,0.75)",
                  maxWidth: "520px",
                  marginBottom: "16px",
                }}
              >
                Your brief has landed in our inbox — a confirmation is on its way to{" "}
                {email.trim()}. We&apos;ll be in touch shortly.
              </p>
              <button
                onClick={close}
                style={{
                  marginTop: "24px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--off-white)",
                  background: "var(--orange)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px 36px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          )}

          {step === 3 && status !== "sent" && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: "24px",
                }}
              >
                Your brief
              </div>
              <blockquote
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "rgba(249,249,249,0.85)",
                  borderLeft: "1px solid rgba(var(--orange-rgb), 0.4)",
                  paddingLeft: "28px",
                  marginBottom: "40px",
                  whiteSpace: "pre-line",
                }}
              >
                {`${deliverable} · ${timeline.toLowerCase()}\n“${note.trim()}”`}
              </blockquote>

              {TURNSTILE_SITE_KEY && (
                <>
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    strategy="lazyOnload"
                    onLoad={() => setTurnstileReady(true)}
                  />
                  <div ref={turnstileRef} style={{ marginBottom: "24px" }} />
                </>
              )}

              <button
                onClick={submitBrief}
                disabled={status === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--off-white)",
                  background: "var(--orange)",
                  padding: "18px 44px",
                  borderRadius: "8px",
                  border: "none",
                  cursor:
                    status === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken)
                      ? "wait"
                      : "pointer",
                  opacity: status === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken) ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending…" : "Submit brief"}
              </button>

              {status === "error" && (
                <p
                  style={{
                    marginTop: "20px",
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "0.9rem",
                    color: "#ff8a6b",
                  }}
                >
                  {errorMessage || "Something went wrong — please try again."}
                </p>
              )}

              <p
                style={{
                  marginTop: "28px",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(249,249,249,0.5)",
                  maxWidth: "460px",
                }}
              >
                Prefer WhatsApp? Every retainer includes a direct line — speed
                dial starts when we do.{" "}
                <span style={{ color: "var(--orange)" }}>
                  {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots
                  open for {RETAINER_SLOTS.month}.
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer: back */}
        {step > 0 && status !== "sent" && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              alignSelf: "flex-start",
              marginTop: "48px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(249,249,249,0.4)",
              padding: "8px 0",
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
