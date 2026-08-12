import {
  LegalPageHeader,
  LegalSection,
  LegalTOC,
} from "@/components/shared/legal-components";

export const metadata = {
  title: "Terms & Conditions | Medivance",
  description:
    "Medivance Terms & Conditions — rules governing authorized use of the platform by institutional healthcare staff.",
};

const tocItems = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility & Accounts" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "clinical-responsibility", label: "Clinical Responsibility" },
  { id: "patient-data", label: "Patient Data Obligations" },
  { id: "ip", label: "Intellectual Property" },
  { id: "account-security", label: "Account Security" },
  { id: "prohibited", label: "Prohibited Conduct" },
  { id: "availability", label: "Availability & Support" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "termination", label: "Suspension & Termination" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes", label: "Changes to These Terms" },
  { id: "contact", label: "Contact" },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalPageHeader
        badge="Terms"
        title="Terms & Conditions"
        subtitle="These Terms & Conditions govern the use of Medivance by authorized healthcare staff — Administrators, Doctors, and Receptionists — acting on behalf of a subscribing institution. By logging in, you agree to be bound by these Terms."
        effectiveDate="August 12, 2026"
        lastUpdated="August 12, 2026"
      />

      <LegalTOC items={tocItems} />

      <div className="space-y-10">
        <LegalSection id="acceptance" title="1. Acceptance of Terms">
          <p>
            By accessing or using Medivance ("the platform"), you confirm that
            you are an individual authorized by a subscribing healthcare
            Institution to use the platform in a professional capacity, and that
            you agree to these Terms & Conditions, our{" "}
            <a
              href="/legal/privacy-policy"
              className="text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Privacy Policy
            </a>
            , and any applicable agreement between your Institution and
            Medivance. If you do not agree, you must not use the platform.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" title="2. Eligibility & Accounts">
          <p>
            Medivance accounts are provisioned exclusively by Institution
            Administrators for staff acting in an official capacity — as an
            Administrator, Doctor, or Receptionist. Self-registration is not
            available. You may not create, share, or transfer an account, and
            you may not permit anyone else to access the platform using your
            credentials.
          </p>
          <p>
            You are responsible for ensuring that the professional credentials
            and role information associated with your account are accurate and
            kept current.
          </p>
        </LegalSection>

        <LegalSection id="acceptable-use" title="3. Acceptable Use">
          <p>
            Use Medivance solely for legitimate clinical, administrative, and
            operational purposes connected to patient care at your Institution.
            You agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Access only the patient records and features necessary for your
              role and job function
            </li>
            <li>
              Keep your login credentials confidential and never share them with
              another person
            </li>
            <li>Log out of, or lock, any shared or unattended workstation</li>
            <li>
              Follow your Institution's internal policies regarding patient data
              handling
            </li>
            <li>
              Report suspected security incidents, unauthorized access, or data
              errors promptly
            </li>
          </ul>
        </LegalSection>

        <LegalSection id="roles" title="4. Roles & Permissions">
          <p>
            Medivance enforces role-based access control across three primary
            roles:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">Administrators</strong> manage
              user accounts, platform settings, security policy, and
              institutional analytics.
            </li>
            <li>
              <strong className="text-foreground">Doctors</strong> review
              studies and imaging, prepare and sign clinical reports, manage
              their patient list, schedule, and watchlist.
            </li>
            <li>
              <strong className="text-foreground">Receptionists</strong> manage
              patient intake, appointments, the arrival board, and doctor
              availability.
            </li>
          </ul>
          <p>
            You agree not to attempt to access features, data, or accounts
            outside the scope of your assigned role, and not to attempt to
            circumvent role-based access controls.
          </p>
        </LegalSection>

        <LegalSection
          id="clinical-responsibility"
          title="5. Clinical Responsibility"
        >
          <p>
            Medivance is a clinical workflow and information management tool. It
            does not practice medicine, does not provide medical advice, and
            does not replace independent clinical judgment. Any analytics,
            comparisons, follow-up suggestions, or similar features are provided
            to support — not substitute for — the treating physician's
            professional assessment.
          </p>
          <p>
            Doctors and other clinical Users remain solely responsible for
            reviewing studies, verifying data accuracy, forming diagnoses,
            preparing and signing reports, and making all clinical decisions
            regarding patient care. Medivance and the Institution rely on Users
            to exercise appropriate professional judgment at all times.
          </p>
        </LegalSection>

        <LegalSection id="patient-data" title="6. Patient Data Obligations">
          <p>
            You agree to enter, access, and handle patient health information
            only as necessary for authorized clinical or administrative
            purposes, and in compliance with applicable health-data regulations
            and your Institution's policies. You must not export, copy, print,
            or transmit patient data outside the platform except through
            channels authorized by your Institution.
          </p>
          <p>
            The Institution, as data controller for patient information entered
            into the platform, is responsible for ensuring it has an appropriate
            legal basis to process that data and for directing its Users
            accordingly.
          </p>
        </LegalSection>

        <LegalSection id="ip" title="7. Intellectual Property">
          <p>
            The Medivance platform, including its software, design, interfaces,
            and branding, is the property of Medivance and its licensors and is
            protected by intellectual property law. These Terms grant you a
            limited, non-exclusive, non-transferable right to use the platform
            for its intended purpose during the term of your Institution's
            agreement. You may not copy, modify, reverse engineer, or create
            derivative works from the platform.
          </p>
          <p>
            Patient records and clinical content entered by Users remain the
            property of the Institution (or the patient, as applicable, under
            local law), not Medivance.
          </p>
        </LegalSection>

        <LegalSection id="account-security" title="8. Account Security">
          <p>
            You are responsible for all activity that occurs under your account.
            Notify your Institution's administrator immediately if you suspect
            your credentials have been compromised or if you notice unauthorized
            activity. Medivance may suspend an account without prior notice
            where necessary to prevent unauthorized access or protect patient
            data.
          </p>
        </LegalSection>

        <LegalSection id="prohibited" title="9. Prohibited Conduct">
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Access, or attempt to access, data or accounts you are not
              authorized to use
            </li>
            <li>
              Attempt to bypass, disable, or interfere with security features,
              authentication, or access controls
            </li>
            <li>
              Introduce malware, or use automated tools to scrape, probe, or
              overload the platform
            </li>
            <li>
              Upload content that is unlawful, or that you do not have the right
              to submit
            </li>
            <li>
              Use the platform for any purpose unrelated to authorized clinical
              or administrative work at your Institution
            </li>
            <li>Misrepresent your identity, role, or authorization level</li>
          </ul>
        </LegalSection>

        <LegalSection id="availability" title="10. Availability & Support">
          <p>
            We aim to keep Medivance available and reliable, but the platform is
            provided on an "as available" basis. Scheduled maintenance, updates,
            or unforeseen technical issues may result in temporary
            interruptions. Support requests should be directed to your
            Institution's administrator or to Medivance support channels
            provided to your Institution.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" title="11. Disclaimers">
          <p>
            Except as expressly agreed in a separate written agreement with your
            Institution, the platform is provided without warranties of any
            kind, whether express or implied, including implied warranties of
            merchantability, fitness for a particular purpose, or
            non-infringement. Medivance does not warrant that the platform will
            be uninterrupted, error-free, or that any content or analytics
            generated by the platform is free from error.
          </p>
        </LegalSection>

        <LegalSection id="liability" title="12. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Medivance will
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages arising from your use of the platform. Nothing
            in these Terms limits liability that cannot lawfully be limited,
            including liability arising from gross negligence or willful
            misconduct, where applicable. Liability related to clinical outcomes
            rests with the treating healthcare professionals and Institution,
            consistent with the{" "}
            <a
              href="#clinical-responsibility"
              className="text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Clinical Responsibility
            </a>{" "}
            section above.
          </p>
        </LegalSection>

        <LegalSection id="indemnification" title="13. Indemnification">
          <p>
            You agree to indemnify and hold Medivance harmless from claims,
            damages, or expenses arising from your misuse of the platform, your
            violation of these Terms, or your violation of applicable law, to
            the extent caused by your own actions.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="14. Suspension & Termination">
          <p>
            Your Institution's administrator may deactivate your account at any
            time, including upon change of role or end of employment. Medivance
            may suspend or terminate access to any account that violates these
            Terms, poses a security risk, or where required by law. Upon
            termination, your right to access the platform ends immediately;
            provisions of these Terms that by their nature should survive
            (including intellectual property, liability, and governing law) will
            continue to apply.
          </p>
        </LegalSection>

        <LegalSection id="governing-law" title="15. Governing Law">
          <p>
            These Terms are governed by the laws applicable under the agreement
            between Medivance and your Institution, without regard to
            conflict-of-law principles, except where local mandatory healthcare
            or data-protection law requires otherwise.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="16. Changes to These Terms">
          <p>
            We may update these Terms from time to time to reflect changes in
            the platform, legal requirements, or our practices. Material changes
            will be reflected by an updated "Last Updated" date, and Institution
            administrators will be notified in advance of significant changes.
            Continued use of the platform after changes take effect constitutes
            acceptance of the revised Terms.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="17. Contact">
          <div className="mt-2 p-5 bg-muted/40 rounded-xl border border-border/60 space-y-2">
            <p className="font-medium text-foreground">
              Medivance — Legal & Compliance
            </p>
            <p>For questions about these Terms & Conditions:</p>
            <p>
              Email:{" "}
              <a
                href="mailto:amr540290@gmail.com"
                className="text-emerald-800 dark:text-emerald-400 hover:underline"
              >
                amr540290@gmail.com
              </a>
            </p>
          </div>
        </LegalSection>
      </div>
    </>
  );
}
