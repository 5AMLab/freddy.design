import LegalLayout from "@/components/v2/LegalLayout";

export const metadata = {
  title: "Privacy Policy — freddi.design",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information when you use freddi.design."
      lastUpdated="June 2025"
      sections={[
        {
          heading: "Who We Are",
          body: "freddi.design is a freelance design studio based in Singapore, operated by Freddy Balian. We provide on-demand graphic design services including presentation decks, brand assets, campaign materials, and more. You can contact us at hello@freddi.design.",
        },
        {
          heading: "What Information We Collect",
          body: [
            "Contact details you provide voluntarily — name, email address, phone or WhatsApp number — when you reach out via the contact form or directly.",
            "Project details and briefs you share with us in the course of engaging our services.",
            "Basic usage data collected automatically by our hosting provider (Vercel), such as page views and general geographic region. No personally identifiable information is included.",
            "No cookies are set by this website for tracking or advertising purposes.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "To respond to your enquiry and discuss your project requirements.",
            "To deliver design services and communicate about ongoing work.",
            "To send occasional updates about our services, only if you have opted in.",
            "We do not sell, rent, or share your personal data with third parties for marketing purposes.",
          ],
        },
        {
          heading: "Legal Basis for Processing (GDPR)",
          body: "If you are located in the European Economic Area or United Kingdom, we process your personal data on the basis of your consent (when you contact us) and our legitimate interest in providing the services you have requested.",
        },
        {
          heading: "Data Retention",
          body: "We retain your contact details and project information for as long as necessary to deliver services and comply with legal obligations, typically no longer than three years after our last interaction. You may request deletion at any time.",
        },
        {
          heading: "Your Rights",
          body: [
            "Access — request a copy of the personal data we hold about you.",
            "Correction — ask us to correct inaccurate or incomplete information.",
            "Deletion — request that we delete your personal data.",
            "Objection — object to our processing of your data.",
            "Portability — receive your data in a structured, machine-readable format.",
            "To exercise any of these rights, email hello@freddi.design.",
          ],
        },
        {
          heading: "Third-Party Services",
          body: "We use Vercel for website hosting. Their privacy policy governs any data collected at the infrastructure level. We may use WhatsApp or email to communicate with clients — these platforms have their own privacy policies.",
        },
        {
          heading: "Singapore PDPA",
          body: "We comply with Singapore's Personal Data Protection Act 2012 (PDPA). You may withdraw consent for the collection, use, or disclosure of your personal data at any time by contacting us, subject to legal and contractual restrictions.",
        },
        {
          heading: "Changes to This Policy",
          body: "We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of this website after changes constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}
