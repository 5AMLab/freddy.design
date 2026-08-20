import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { contactPageSchema } from "@/lib/schema";
import ContactPage from "@/components/v2/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio Kavea — a brand and creative direction studio in Singapore. Email hello@kavea.studio or start a brief.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <ContactPage />
    </>
  );
}
