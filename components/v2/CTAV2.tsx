"use client";

export default function CTAV2() {
  return (
    <>

      <section
        id="cta"
        className="cta-v2-section"
        style={{
          background: "#0D0D0D",
          borderTop: "1px solid rgba(201,169,110,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background large type */}
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            right: "-20px",
            fontFamily: "'Canela', serif",
            fontSize: "clamp(8rem, 18vw, 20rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(201,169,110,0.04)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Let&apos;s talk
        </div>

        <div
          className="cta-v2-inner"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "80px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Sohne Breit', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C9A96E",
                marginBottom: "24px",
              }}
            >
              Start a Conversation
            </div>
            <h2
              style={{
                fontFamily: "'Canela', serif",
                fontSize: "clamp(2.8rem, 5vw, 5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "#F5F0E8",
                marginBottom: "20px",
              }}
            >
              Ready to have a designer
              <br />
              <em style={{ color: "#C9A96E" }}>on speed dial?</em>
            </h2>
            <p
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontSize: "1rem",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "rgba(245,240,232,0.65)",
                maxWidth: "440px",
              }}
            >
              No contracts. No overhead. Just great design, whenever you need it.
            </p>
          </div>

          <div style={{ flexShrink: 0 }}>
            <a
              href="#"
              style={{
                display: "inline-block",
                fontFamily: "'Sohne', sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0D0D0D",
                background: "#C9A96E",
                padding: "20px 52px",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "0.85";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }}
            >
              Start a Conversation
            </a>
            <div
              style={{
                marginTop: "16px",
                textAlign: "center",
                fontFamily: "'Sohne', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 300,
                letterSpacing: "0.1em",
                color: "rgba(245,240,232,0.2)",
                textTransform: "uppercase",
              }}
            >
              via WhatsApp or email
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
