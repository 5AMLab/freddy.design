"use client";
import { useEffect, useRef } from "react";

const plans = [
  {
    name: "Starter",
    hours: "10 hrs / month",
    price: "$1,200",
    period: "SGD per month",
    features: [
      "Up to 10 design hours",
      "48hr turnaround",
      "Direct WhatsApp line",
      "Shared brand asset folder",
      "All service types included",
    ],
    featured: false,
  },
  {
    name: "Standard",
    hours: "20 hrs / month",
    price: "$2,000",
    period: "SGD per month",
    features: [
      "Up to 20 design hours",
      "48hr turnaround",
      "Priority WhatsApp line",
      "Shared brand asset folder",
      "Top-up at $120/hr",
    ],
    featured: true,
  },
  {
    name: "Priority",
    hours: "30 hrs / month",
    price: "$2,800",
    period: "SGD per month",
    features: [
      "Up to 30 design hours",
      "24hr turnaround",
      "Dedicated hotline",
      "Shared brand asset folder",
      "Top-up at $100/hr",
    ],
    featured: false,
  },
];

export default function PricingV2() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("v2-visible"), i * 120);
          }
        });
      },
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".v2-fade").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>

      <section
        id="pricing"
        ref={ref}
        className="pricing-v2-section"
        style={{ padding: "120px 72px", background: "#0D0D0D" }}
      >
        <div className="v2-fade" style={{ marginBottom: "72px" }}>
          <div
            style={{
              fontFamily: "'Sohne Breit', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9A96E",
              marginBottom: "20px",
            }}
          >
            Retainer Plans
          </div>
          <h2
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "#F5F0E8",
            }}
          >
            Predictable costs.
            <br />
            Zero overhead.
          </h2>
        </div>

        <div
          className="pricing-v2-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(245,240,232,0.06)",
            border: "1px solid rgba(245,240,232,0.12)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="v2-fade"
              style={{
                background: plan.featured ? "rgba(201,169,110,0.06)" : "#0D0D0D",
                padding: "52px 40px",
                position: "relative",
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    height: "1px",
                    background: "linear-gradient(to right, transparent, #C9A96E, transparent)",
                  }}
                />
              )}

              <div
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.55)",
                  marginBottom: "8px",
                }}
              >
                {plan.hours}
              </div>

              <div
                style={{
                  fontFamily: "'Canela', serif",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: plan.featured ? "#C9A96E" : "#F5F0E8",
                  marginBottom: "28px",
                }}
              >
                {plan.name}
                {plan.featured && (
                  <span
                    style={{
                      marginLeft: "12px",
                      fontFamily: "'Sohne', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#C9A96E",
                      border: "1px solid rgba(201,169,110,0.4)",
                      padding: "3px 10px",
                      borderRadius: "2px",
                      verticalAlign: "middle",
                    }}
                  >
                    Popular
                  </span>
                )}
              </div>

              <div
                style={{
                  fontFamily: "'Canela Deck', serif",
                  fontSize: "3.6rem",
                  fontWeight: 300,
                  color: "#F5F0E8",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {plan.price}
              </div>
              <div
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "rgba(245,240,232,0.45)",
                  marginBottom: "36px",
                  letterSpacing: "0.04em",
                }}
              >
                {plan.period}
              </div>

              <ul style={{ listStyle: "none", marginBottom: "40px" }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontFamily: "'Sohne', sans-serif",
                      fontSize: "0.88rem",
                      fontWeight: 400,
                      color: "rgba(245,240,232,0.70)",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(245,240,232,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: plan.featured ? "#C9A96E" : "rgba(245,240,232,0.2)",
                        flexShrink: 0,
                      }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: plan.featured ? "#0D0D0D" : "#C9A96E",
                  background: plan.featured ? "#C9A96E" : "transparent",
                  border: `1px solid ${plan.featured ? "#C9A96E" : "rgba(201,169,110,0.3)"}`,
                  padding: "16px",
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s, opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (plan.featured) {
                    el.style.opacity = "0.85";
                  } else {
                    el.style.background = "rgba(201,169,110,0.08)";
                    el.style.borderColor = "#C9A96E";
                    el.style.color = "#C9A96E";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (plan.featured) {
                    el.style.opacity = "1";
                  } else {
                    el.style.background = "transparent";
                    el.style.borderColor = "rgba(201,169,110,0.3)";
                  }
                }}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div
          className="v2-fade"
          style={{
            marginTop: "28px",
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 400,
            color: "rgba(245,240,232,0.40)",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
          }}
        >
          A design hour covers any task — deck slides, social assets, print files, brand work. Hours are tracked per deliverable and shared transparently. Unused hours do not roll over.
        </div>
      </section>
    </>
  );
}
