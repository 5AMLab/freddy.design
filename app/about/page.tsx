import type { Metadata } from "next";
import KloaqAbout from "@/components/v2/KloaqAbout";
import JsonLd from "@/components/JsonLd";
import { founderSchema } from "@/lib/schema";

export const metadata: Metadata = {
  // NOT "About Studio Kavea — ..." : the root layout's title template
  // appends " — Studio Kavea", which made the rendered title read
  // "About Studio Kavea — Brand & Creative Direction, Singapore — Studio
  // Kavea". The spec's suggested string assumed no template.
  title: "About — Brand & Creative Direction in Singapore",
  description:
    "One small team, one voice, ten years, no account layer. How Studio Kavea runs briefs from idea to shipped file, and the principles that keep the work consistent.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Person node, linked to the Organization by @id in both directions.
          This is what ties site + Behance into one entity for search. */}
      <JsonLd data={founderSchema()} />
      <KloaqAbout />
    </>
  );
}
