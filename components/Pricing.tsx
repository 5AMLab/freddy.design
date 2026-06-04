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

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: start;
        }
        .pricing-card-featured {
          transform: scale(1.04);
        }
        .pricing-card-featured:hover {
          transform: scale(1.04) translate(-4px, -4px) !important;
        }
        @media (max-width: 768px) {
          .pricing-section { padding: 60px 20px !important; }
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-card-featured { transform: scale(1) !important; }
          .pricing-card-featured:hover { transform: translate(-4px, -4px) !important; }
        }
      `}</style>

      <section
        id="pricing"
        className="pricing-section"
        ref={ref}
        style={{ padding: "100px 60px", background: "#FFF8EE" }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#E8222E",
            marginBottom: "12px",
          }}
        >
          Retainer Plans
        </div>
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)",
            lineHeight: 1.1,
            marginBottom: "56px",
            maxWidth: "640px",
          }}
        >
          Predictable costs. Zero overhead.
        </h2>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`fade-in${plan.featured ? " pricing-card-featured" : ""}`}
              style={{
                background: plan.featured ? "#E8222E" : "white",
                color: plan.featured ? "white" : "inherit",
                border: "3px solid #0f0f0f",
                borderRadius: "24px",
                padding: "40px 36px",
                boxShadow: "6px 6px 0 #0f0f0f",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                if (plan.featured) {
                  el.style.transform = "scale(1.04) translate(-4px, -4px)";
                } else {
                  el.style.transform = "translate(-4px, -4px)";
                }
                el.style.boxShadow = "10px 10px 0 #0f0f0f";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                if (plan.featured) {
                  el.style.transform = "scale(1.04)";
                } else {
                  el.style.transform = "translate(0, 0)";
                }
                el.style.boxShadow = "6px 6px 0 #0f0f0f";
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#FFD93D",
                    color: "#0f0f0f",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "4px 16px",
                    borderRadius: "50px",
                    border: "2px solid #0f0f0f",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "1.7rem",
                  marginBottom: "4px",
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: plan.featured ? "rgba(255,255,255,0.7)" : "#888",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {plan.hours}
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "3.2rem",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {plan.price}
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: plan.featured ? "rgba(255,255,255,0.7)" : "#888",
                  marginBottom: "28px",
                }}
              >
                {plan.period}
              </div>

              <ul
                className={plan.featured ? "plan-features-featured" : "plan-features"}
                style={{ listStyle: "none", marginBottom: "28px" }}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      padding: "9px 0",
                      borderBottom: plan.featured
                        ? "1px dashed rgba(255,255,255,0.2)"
                        : "1px dashed #eee",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: plan.featured ? "rgba(255,255,255,0.9)" : "#444",
                    }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "50px",
                  border: plan.featured ? "3px solid white" : "3px solid #0f0f0f",
                  background: plan.featured ? "white" : "#0f0f0f",
                  color: plan.featured ? "#0f0f0f" : "white",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  if (plan.featured) {
                    btn.style.background = "#0f0f0f";
                    btn.style.color = "white";
                    btn.style.borderColor = "#0f0f0f";
                  } else {
                    btn.style.background = "#E8222E";
                    btn.style.borderColor = "#E8222E";
                  }
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  if (plan.featured) {
                    btn.style.background = "white";
                    btn.style.color = "#0f0f0f";
                    btn.style.borderColor = "white";
                  } else {
                    btn.style.background = "#0f0f0f";
                    btn.style.borderColor = "#0f0f0f";
                    btn.style.color = "white";
                  }
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
