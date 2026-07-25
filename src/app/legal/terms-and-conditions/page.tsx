import { LegalPageHeader, LegalSection } from "@/components/shared/legal-components";

export const metadata = { title: "Terms & Conditions | Medivance" };

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalPageHeader badge="Terms" title="Terms & Conditions" subtitle="Terms for authorized use of the Medivance platform." effectiveDate="August 12, 2026" lastUpdated="August 12, 2026" />
      <LegalSection id="use" title="Authorized Use"><p>Use Medivance only for authorized clinical and administrative work. Keep account credentials confidential and follow your institution&apos;s policies.</p></LegalSection>
      <LegalSection id="responsibility" title="Clinical Responsibility"><p>Healthcare professionals remain responsible for reviewing studies, preparing reports, and making clinical decisions.</p></LegalSection>
    </>
  );
}
