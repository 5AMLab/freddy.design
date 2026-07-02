"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Logo wall for the /kloaq review page — same brands as the live site's
// LogosV2, sized up 1.5x (28px → 42px). Unlike the live version (a static
// centered row), this one scrolls edge-to-edge as a continuous marquee, and
// the marks are recolored orange to match the word-cloud accent instead of
// sitting at their native brand colors.
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

    const setWidth = () => track.scrollWidth / 2;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;

      const half = setWidth();
      if (half <= 0) return;

      let next = offsetRef.current + delta;
      // wrap so the seam between the two duplicated sets is never visible
      next = ((next % half) + half) % half;
      offsetRef.current = next;

      track.style.transform = `translateX(${-next}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
