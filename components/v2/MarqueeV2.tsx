export default function MarqueeV2() {
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

  const doubled = [...items, ...items];

  return (
    <div
      style={{
        background: "#0D0D0D",
        padding: "20px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(201,169,110,0.15)",
        borderBottom: "1px solid rgba(201,169,110,0.15)",
      }}
    >
      <div className="animate-marquee" style={{ display: "flex", gap: "60px" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "0.95rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(245,240,232,0.35)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              letterSpacing: "0.05em",
            }}
          >
            {item}
            <span style={{ color: "rgba(201,169,110,0.5)", fontSize: "0.5rem" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
