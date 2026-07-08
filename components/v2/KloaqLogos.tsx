"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Logo wall for the homepage and /kloaq. Scrolls edge-to-edge as a
// continuous marquee, with the marks recolored orange to match the
// word-cloud accent instead of sitting at their native brand colors.
const logos = [
  { name: "SK-II", src: "/logos/SK-II.svg" },
  { name: "Digital Realty", src: "/logos/digital realty.svg" },
  { name: "LVMH", src: "/logos/lvmh.svg" },
  { name: "Samsung", src: "/logos/samsung.svg" },
  { name: "ANZ", src: "/logos/anz.svg" },
  { name: "MBS", src: "/logos/mbs.svg" },
  { name: "Epson", src: "/logos/epson.svg" },
  { name: "Lacoste", src: "/logos/lacoste.svg" },
];

function LogoSet({ setKey }: { setKey: string }) {
  return (
    <div className="kloaq-logos-set" aria-hidden={setKey !== "a"}>
      {logos.map((logo) => (
        <div className="kloaq-logo-item" key={`${setKey}-${logo.name}`}>
          <Image
            src={logo.src}
            alt={logo.name}
            // Variable-width SVG marks pinned to a fixed 42px height, width by
            // aspect ratio. height:"42px" (not "auto") must stay in the inline
            // style — next/image injects its own inline width/height, which
            // beats the .kloaq-logo-item img CSS rule, so the real size has to
            // be set inline here too or the mark collapses to 0. width={0}
            // keeps the intrinsic aspect ratio unconstrained.
            width={0}
            height={42}
            style={{ width: "auto", height: "42px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function KloaqLogos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    lastScrollYRef.current = window.scrollY;

    // scrollWidth is a forced-layout read — doing it inside the scroll
    // handler meant a synchronous reflow on EVERY scroll event, page-wide,
    // interleaved with this handler's own transform write (classic
    // read-after-write thrash; Safari pays for it far more than Blink/Gecko).
    // Cache it and refresh only when the track actually resizes.
    let half = track.scrollWidth / 2;
    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    ro.observe(track);

    // Only scrub the marquee while it's actually near the viewport — a
    // transform write per scroll event on an off-screen track still dirties
    // style/layout every frame for the whole rest of the page.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(track);

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (!onScreen || half <= 0) return;

      let next = offsetRef.current + delta;
      // wrap so the seam between the two duplicated sets is never visible
      next = ((next % half) + half) % half;
      offsetRef.current = next;

      track.style.transform = `translateX(${-next}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section className="kloaq-logos-section">
      <div className="kloaq-logos-track" ref={trackRef}>
        <LogoSet setKey="a" />
        <LogoSet setKey="b" />
      </div>
    </section>
  );
}
