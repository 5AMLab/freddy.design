"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { CONTACT_EMAIL, RETAINER_SLOTS } from "@/lib/site";

export const OPEN_BRIEF_EVENT = "fd:open-brief";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // open on demand, reset to a fresh flow each time
  useEffect(() => {
    const onOpen = () => {
      setStep(0);
      setDeliverable("");
      setTimeline("");
      setNote("");
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

  if (!open) return null;

  const subject = `Design brief — ${deliverable}`;
  const body = [
    "Hi Freddy,",
    "",
    `What I need: ${deliverable}`,
    `Timeline: ${timeline}`,
    "",
    note,
    "",
    name ? `— ${name}` : "",
  ]
    .join("\n")
    .trim();
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
        borderBottom: "1px solid rgba(245,240,232,0.12)",
        padding: "22px 0",
        cursor: "pointer",
        fontFamily: "'Canela', serif",
        fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)",
        fontWeight: 300,
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
        background: "rgba(13,13,13,0.98)",
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
              fontFamily: "'Sohne Breit', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9A96E",
            }}
          >
            Brief Me{" "}
            <span style={{ color: "rgba(245,240,232,0.3)", marginLeft: "12px" }}>
              {String(Math.min(step + 1, 4)).padStart(2, "0")} / 04
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              background: "none",
              border: "1px solid rgba(201,169,110,0.35)",
              borderRadius: "2px",
              color: "rgba(245,240,232,0.7)",
              fontFamily: "'Sohne', sans-serif",
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
                fontFamily: "'Canela', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "#F5F0E8",
                marginBottom: "clamp(28px, 5vh, 56px)",
              }}
            >
              {QUESTIONS[step]}
              {step === 2 && (
                <span
                  style={{
                    display: "block",
                    fontSize: "1.05rem",
                    fontFamily: "'Sohne', sans-serif",
                    fontWeight: 300,
                    color: "rgba(245,240,232,0.5)",
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
            <div style={{ borderTop: "1px solid rgba(245,240,232,0.12)" }}>
              {DELIVERABLES.map((d) => optionRow(d, pick(setDeliverable)))}
            </div>
          )}

          {step === 1 && (
            <div style={{ borderTop: "1px solid rgba(245,240,232,0.12)" }}>
              {TIMELINES.map((t) => optionRow(t, pick(setTimeline)))}
            </div>
          )}

          {step === 2 && (
            <div>
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
                  borderBottom: "1px solid rgba(201,169,110,0.35)",
                  outline: "none",
                  resize: "vertical",
                  padding: "8px 0 16px",
                  fontFamily: "'Canela', serif",
                  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "#F5F0E8",
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
                  borderBottom: "1px solid rgba(245,240,232,0.15)",
                  outline: "none",
                  padding: "8px 0 12px",
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "rgba(245,240,232,0.8)",
                }}
              />
              <button
                onClick={() => setStep(3)}
                disabled={!note.trim()}
                style={{
                  marginTop: "40px",
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0D0D0D",
                  background: note.trim() ? "#C9A96E" : "rgba(201,169,110,0.25)",
                  border: "none",
                  borderRadius: "2px",
                  padding: "16px 36px",
                  cursor: note.trim() ? "pointer" : "not-allowed",
                  transition: "background 0.3s",
                }}
              >
                Review brief →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div
                style={{
                  fontFamily: "'Sohne Breit', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C9A96E",
                  marginBottom: "24px",
                }}
              >
                Your brief
              </div>
              <blockquote
                style={{
                  fontFamily: "'Canela', serif",
                  fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  color: "rgba(245,240,232,0.85)",
                  borderLeft: "1px solid rgba(201,169,110,0.4)",
                  paddingLeft: "28px",
                  marginBottom: "40px",
                  whiteSpace: "pre-line",
                }}
              >
                {`${deliverable} · ${timeline.toLowerCase()}\n“${note.trim()}”`}
              </blockquote>

              <a
                href={mailto}
                style={{
                  display: "inline-block",
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#0D0D0D",
                  background: "#C9A96E",
                  padding: "18px 44px",
                  borderRadius: "2px",
                  textDecoration: "none",
                }}
              >
                Send it by email
              </a>

              <p
                style={{
                  marginTop: "28px",
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(245,240,232,0.5)",
                  maxWidth: "460px",
                }}
              >
                Prefer WhatsApp? Every retainer includes a direct line — speed
                dial starts when we do.{" "}
                <span style={{ color: "#C9A96E" }}>
                  {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots
                  open for {RETAINER_SLOTS.month}.
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer: back */}
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              alignSelf: "flex-start",
              marginTop: "48px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.4)",
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
