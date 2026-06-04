"use client";
export default function CTA() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .cta-section { padding: 72px 20px !important; }
        }
      `}</style>
      <section
        id="cta"
        className="cta-section cta-stars"
        style={{
          padding: "100px 60px",
          background: "#E8222E",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "white",
            marginBottom: "20px",
            lineHeight: 1.1,
          }}
        >
          Ready to have a designer
          <br />
          on speed dial?
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "500px",
            margin: "0 auto 40px",
            fontWeight: 600,
            lineHeight: 1.7,
          }}
        >
          No contracts. No overhead. Just great design, whenever you need it.
        </p>
        <a
          href="#"
          style={{
            background: "white",
            color: "#0f0f0f",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            padding: "18px 48px",
            borderRadius: "50px",
            border: "3px solid white",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "5px 5px 0 rgba(0,0,0,0.2)",
            transition: "background 0.2s, color 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "#0f0f0f";
            el.style.color = "white";
            el.style.borderColor = "#0f0f0f";
            el.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "white";
            el.style.color = "#0f0f0f";
            el.style.borderColor = "white";
            el.style.transform = "translateY(0)";
          }}
        >
          Start a Conversation →
        </a>
      </section>
    </>
  );
}
