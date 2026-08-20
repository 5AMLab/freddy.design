import type { Metadata } from "next";
import KloaqPricing from "@/components/v2/KloaqPricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flat monthly retainer plans — one small team on speed dial. Predictable costs, zero overhead. Starter, Standard and Priority tiers from $1,200 SGD/month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <KloaqPricing />;
}
