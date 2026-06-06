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

  const renderSet = (prefix: string) =>
    items.flatMap((item, i) => [
      <span
        key={`${prefix}-d-${i}`}
        aria-hidden
        style={{ color: "rgba(201,169,110,0.5)", fontSize: "0.5rem", flexShrink: 0 }}
      >
        ◆
      </span>,
      <span
        key={`${prefix}-t-${i}`}
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "0.95rem",
          fontStyle: "italic",
          fontWeight: 300,
          color: "rgba(245,240,232,0.35)",
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
        }}
      >
        {item}
      </span>,
    ]);

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
      {/* Two identical copies side-by-side; animation slides the whole track by 50%
          so it loops back to an identical visual state — no visible jump. */}
      <div
        className="animate-marquee"
        style={{ display: "flex", alignItems: "center", gap: "28px" }}
      >
        {[...renderSet("a"), ...renderSet("b")]}
      </div>
    </div>
  );
}
