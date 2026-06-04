"use client";
export default function Footer() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 32px 20px !important;
          }
        }
      `}</style>
      <footer
        style={{
          background: "#0f0f0f",
          borderTop: "3px solid #E8222E",
        }}
      >
        <div
          className="footer-inner"
          style={{
            padding: "40px 60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "1.5rem",
              color: "white",
            }}
          >
            freddy<span style={{ color: "#E8222E" }}>.</span>design
          </div>

          <p style={{ color: "#555", fontSize: "0.95rem", fontWeight: 600 }}>
            © 2025 freddy.design · Singapore
          </p>

          <ul
            style={{
              display: "flex",
              gap: "24px",
              listStyle: "none",
            }}
          >
            {["Instagram", "LinkedIn", "WhatsApp"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    color: "#666",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#E8222E")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#666")
                  }
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
