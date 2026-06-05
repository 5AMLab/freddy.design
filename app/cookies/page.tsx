import LegalLayout from "@/components/v2/LegalLayout";

export const metadata = {
  title: "Cookie Policy — freddy.design",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="A straightforward explanation of how this website uses cookies and similar technologies."
      lastUpdated="June 2025"
      sections={[
        {
          heading: "The Short Version",
          body: "freddy.design does not use cookies for tracking, advertising, or analytics. This website is intentionally minimal — no third-party tracking scripts, no ad networks, no retargeting pixels.",
        },
        {
          heading: "What Are Cookies",
          body: "Cookies are small text files stored on your device when you visit a website. They can be used to remember preferences, keep you logged in, or track your behaviour across sites. Some cookies are essential for a site to function; others are optional.",
        },
        {
          heading: "Cookies We Use",
          body: [
            "Essential / functional cookies only — these are set by the browser or our hosting infrastructure (Vercel) to ensure basic site functionality such as security and page delivery. They do not track you personally.",
            "No analytics cookies — we do not currently use Google Analytics, Mixpanel, or any other analytics platform that sets cookies.",
            "No marketing or advertising cookies — we do not run retargeting campaigns or share data with ad networks.",
            "No social media tracking pixels — no Facebook Pixel, LinkedIn Insight Tag, or similar.",
          ],
        },
        {
          heading: "Third-Party Services",
          body: "Our site is hosted on Vercel. Vercel may set technical cookies necessary for infrastructure and security purposes. These are outside our direct control. Please refer to Vercel's privacy policy for details.",
        },
        {
          heading: "Managing Cookies",
          body: "Since we do not set non-essential cookies, there is nothing to opt out of on our end. You can control or delete cookies at any time through your browser settings. Disabling essential cookies may affect site functionality.",
        },
        {
          heading: "If We Add Analytics in Future",
          body: "Should we introduce any analytics or tracking tools in the future, we will update this policy and implement a consent mechanism before any cookies are set. We are committed to being transparent about any changes.",
        },
        {
          heading: "Contact",
          body: "If you have any questions about our use of cookies, please contact us at hello@freddy.design.",
        },
      ]}
    />
  );
}
