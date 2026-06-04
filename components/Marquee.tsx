export default function Marquee() {
  const items = [
    "Presentation Decks",
    "Social Content",
    "Restaurant Menus",
    "Brand Campaigns",
    "Marketplace Banners",
    "Event Identity",
    "Poster & Ad Design",
    "Hero Campaign Images",
  ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        background: "#0f0f0f",
        padding: "18px 0",
        overflow: "hidden",
        borderTop: "3px solid #E8222E",
        borderBottom: "3px solid #E8222E",
      }}
    >
      <div className="animate-marquee" style={{ display: "flex", gap: "48px" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "1.05rem",
              color: "white",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {item}{" "}
            <span style={{ color: "#E8222E", fontSize: "1.2rem" }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
