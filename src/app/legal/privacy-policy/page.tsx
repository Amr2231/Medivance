import { LegalPageHeader, LegalSection } from "@/components/shared/legal-components";

export const metadata = { title: "Privacy Policy | Medivance" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPageHeader badge="Privacy" title="Privacy Policy" subtitle="How Medivance handles patient, study, and account information." effectiveDate="August 12, 2026" lastUpdated="August 12, 2026" />
      <LegalSection id="data" title="Information We Handle">
        <p>We process account details, patient records, medical images, reports, and operational records only to provide clinic services.</p>
      </LegalSection>
      <LegalSection id="security" title="Security and Retention">
        <p>Access is restricted to authorized users. Information is protected with access controls and retained according to your institution&apos;s applicable requirements.</p>
      </LegalSection>
    </>
  );
}
