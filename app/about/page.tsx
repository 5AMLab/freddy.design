import type { Metadata } from "next";
import KloaqAbout from "@/components/v2/KloaqAbout";

export const metadata: Metadata = {
  title: "About — Studio Kavea",
  description:
    "One small team, one voice, ten years, no account layer. How Studio Kavea runs briefs from idea to shipped file, and the principles that keep the work consistent.",
};

export default function AboutPage() {
  return <KloaqAbout />;
}
