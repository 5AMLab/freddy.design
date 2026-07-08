import LegalLayout from "@/components/v2/LegalLayout";

export const metadata = {
  title: "Terms & Conditions — freddi.design",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="The terms that govern your use of freddi.design and our design services."
      lastUpdated="June 2025"
      sections={[
        {
          heading: "Agreement",
          body: "By accessing this website or engaging freddi.design for services, you agree to these terms. If you do not agree, please do not use this site or our services. These terms are governed by the laws of Singapore.",
        },
        {
          heading: "Services",
          body: "freddi.design provides graphic design services on a retainer or project basis, including but not limited to presentation decks, brand assets, campaign materials, print collateral, and marketplace graphics. The specific scope of work is agreed upon in writing prior to commencement.",
        },
        {
          heading: "Retainer Plans",
          body: [
            "Retainer fees are billed monthly in advance in Singapore Dollars (SGD).",
            "Unused hours do not roll over to the following month unless otherwise agreed in writing.",
            "Either party may cancel the retainer with 30 days written notice.",
            "Retainer plans do not cover third-party costs such as stock imagery, printing, or software licences unless explicitly included in your plan.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "Payment is due within 7 days of invoice unless otherwise agreed.",
            "Late payments may incur a 1.5% monthly interest charge.",
            "Work will be paused on accounts with overdue invoices exceeding 14 days.",
            "All fees are exclusive of applicable taxes.",
          ],
        },
        {
          heading: "Revisions",
          body: "We offer unlimited revisions within the agreed project scope. Revisions that constitute a material change in scope, direction, or deliverables may be treated as a new brief and quoted separately.",
        },
        {
          heading: "Intellectual Property",
          body: "Upon receipt of full payment, you own the final deliverables. freddi.design retains the right to display completed work in our portfolio unless you request otherwise in writing. All preliminary concepts, unused drafts, and working files remain the property of freddi.design.",
        },
        {
          heading: "Client Responsibilities",
          body: [
            "Provide accurate briefs, content, and feedback in a timely manner.",
            "Ensure you have the rights to any materials (logos, images, text) supplied to us.",
            "Obtain any necessary approvals, licences, or clearances for your final materials.",
          ],
        },
        {
          heading: "Limitation of Liability",
          body: "freddi.design's total liability for any claim arising from our services shall not exceed the total fees paid in the three months preceding the claim. We are not liable for indirect, consequential, or incidental damages including loss of revenue or business opportunity.",
        },
        {
          heading: "Confidentiality",
          body: "Both parties agree to keep confidential any proprietary information shared during the engagement. This obligation survives termination of the working relationship.",
        },
        {
          heading: "Changes to These Terms",
          body: "We reserve the right to update these terms at any time. Updates take effect upon posting to this page. Continued use of our services after changes constitutes your acceptance.",
        },
      ]}
    />
  );
}
