import { LegalPageHeader, LegalSection } from "@/components/shared/legal-components";

export const metadata = { title: "Security Policy | Medivance" };

export default function SecurityPolicyPage() {
  return (
    <>
      <LegalPageHeader badge="Security" title="Security & Data Protection" subtitle="How we protect clinical and account information." effectiveDate="August 12, 2026" lastUpdated="August 12, 2026" />
      <LegalSection id="controls" title="Access Controls"><p>Role-based access controls, authenticated sessions, and audit records help protect patient and operational data.</p></LegalSection>
      <LegalSection id="reporting" title="Reporting Concerns"><p>Report suspected security incidents to your institution&apos;s administrator promptly.</p></LegalSection>
    </>
  );
}
