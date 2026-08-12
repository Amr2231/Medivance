import {
  LegalPageHeader,
  LegalSection,
  LegalTOC,
} from "@/components/shared/legal-components";

export const metadata = {
  title: "Cookie Policy | Medivance",
  description:
    "Medivance Cookie Policy — how and why we use cookies and similar technologies.",
};

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "what-are-cookies", label: "What Are Cookies?" },
  { id: "authentication-cookies", label: "Authentication Cookies" },
  { id: "session-cookies", label: "Session Management Cookies" },
  { id: "security-cookies", label: "Security Cookies" },
  { id: "preference-cookies", label: "Preference & UI Cookies" },
  { id: "analytics-cookies", label: "Analytics Cookies" },
  { id: "no-third-party", label: "No Third-Party Advertising Cookies" },
  { id: "managing-cookies", label: "Managing Cookies" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

interface CookieTableRowProps {
  name: string;
  purpose: string;
  duration: string;
  type: string;
}

function CookieRow({ name, purpose, duration, type }: CookieTableRowProps) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 py-3 border-b border-border/40 text-sm last:border-0">
      <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-foreground self-start mt-0.5">
        {name}
      </code>
      <span>{purpose}</span>
      <span className="text-muted-foreground">{duration}</span>
      <span className="text-muted-foreground">{type}</span>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      <LegalPageHeader
        badge="Legal Document"
        title="Cookie Policy"
        subtitle="This Cookie Policy explains how Medivance uses cookies and similar tracking technologies when you access the platform. Medivance applies a minimal, purpose-limited approach to cookies — we use only what is strictly necessary for platform security and operation."
        effectiveDate="January 1, 2025"
        lastUpdated="June 1, 2025"
      />

      <LegalTOC items={tocItems} />

      <div className="space-y-10">
        <LegalSection id="overview" title="1. Overview">
          <p>
            Medivance is a healthcare platform accessible only to authorized
            institutional staff. Unlike consumer websites, Medivance does not
            operate advertising networks, social media integrations, or
            public-facing tracking systems. Accordingly, the cookies used by EV
            Platform are limited to those strictly necessary for authentication,
            session management, security enforcement, and minimal user interface
            preference storage.
          </p>
          <p>
            Medivance does not use cookies to track users across websites, build
            behavioral profiles, or deliver targeted advertising. No cookie data
            from Medivance is shared with third-party advertisers, data brokers,
            or social media platforms.
          </p>
        </LegalSection>

        <LegalSection id="what-are-cookies" title="2. What Are Cookies?">
          <p>
            Cookies are small text files placed on a user's device by a web
            application. They allow the application to recognize the user's
            browser on subsequent requests within the same session or across
            sessions (depending on cookie type), enabling features such as
            maintaining a logged-in state, remembering user preferences, and
            detecting security threats.
          </p>
          <p>
            <strong className="text-foreground">Session cookies</strong> exist
            only for the duration of a browser session and are deleted when the
            browser is closed.{" "}
            <strong className="text-foreground">Persistent cookies</strong>{" "}
            remain on the device for a defined period or until explicitly
            deleted. Medivance uses both types, as described below.
          </p>
          <p>
            <strong className="text-foreground">First-party cookies</strong> are
            set directly by Medivance's domain. Medivance uses only first-party
            cookies. No third-party cookies are set or read by the platform in
            normal operation.
          </p>
        </LegalSection>

        <LegalSection
          id="authentication-cookies"
          title="3. Authentication Cookies"
        >
          <p>
            Authentication cookies are essential for the secure operation of the
            platform. They enable the system to verify a user's identity across
            requests without requiring repeated credential submission. Without
            authentication cookies, the platform cannot maintain a user's
            logged-in state.
          </p>
          <div className="mt-4 rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 px-4 py-2 bg-muted/60 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border/60">
              <span>Cookie Name</span>
              <span>Purpose</span>
              <span>Duration</span>
              <span>Type</span>
            </div>
            <div className="px-4">
              <CookieRow
                name="next-auth.session-token"
                purpose="Stores the encrypted session token that authenticates the user to the platform after login. Required for all authenticated requests."
                duration="Session / up to 24 hours"
                type="First-party, Secure, HttpOnly"
              />
              <CookieRow
                name="next-auth.csrf-token"
                purpose="A Cross-Site Request Forgery (CSRF) prevention token that validates the authenticity of form submissions, including the login form."
                duration="Session"
                type="First-party, Secure"
              />
              <CookieRow
                name="next-auth.callback-url"
                purpose="Stores the URL the user should be redirected to after successful authentication. Used to return users to their intended destination post-login."
                duration="Session"
                type="First-party, Secure"
              />
            </div>
          </div>
          <p>
            Authentication cookies are classified as strictly necessary under
            GDPR and equivalent regulations. They do not require user consent as
            they are essential for the secure provision of the service.
          </p>
        </LegalSection>

        <LegalSection
          id="session-cookies"
          title="4. Session Management Cookies"
        >
          <p>
            Session management cookies maintain the continuity of a user's
            interaction with the platform during a single working session. They
            ensure that user navigation, form state, and application context are
            preserved as users move between different parts of the platform.
          </p>
          <div className="mt-4 rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 px-4 py-2 bg-muted/60 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border/60">
              <span>Cookie Name</span>
              <span>Purpose</span>
              <span>Duration</span>
              <span>Type</span>
            </div>
            <div className="px-4">
              <CookieRow
                name="__Host-session"
                purpose="Maintains the user's active session context, including role state and application navigation history."
                duration="Session"
                type="First-party, Secure, HttpOnly"
              />
              <CookieRow
                name="sidebar-state"
                purpose="Stores the user's preferred sidebar collapsed/expanded state to maintain a consistent UI experience across page navigation."
                duration="30 days"
                type="First-party"
              />
            </div>
          </div>
        </LegalSection>

        <LegalSection id="security-cookies" title="5. Security Cookies">
          <p>
            Security cookies support the platform's threat detection and access
            control systems. They help identify unusual access patterns, prevent
            session hijacking, and enforce rate limits on sensitive operations.
          </p>
          <div className="mt-4 rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 px-4 py-2 bg-muted/60 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border/60">
              <span>Cookie Name</span>
              <span>Purpose</span>
              <span>Duration</span>
              <span>Type</span>
            </div>
            <div className="px-4">
              <CookieRow
                name="__Secure-csrf"
                purpose="An additional CSRF token layer applied to sensitive administrative and clinical operations within the platform."
                duration="Session"
                type="First-party, Secure, HttpOnly, SameSite=Strict"
              />
              <CookieRow
                name="ev-device-hint"
                purpose="A non-identifying device fingerprint hint used to detect anomalous session reuse or session token theft without storing personally identifiable information."
                duration="7 days"
                type="First-party, Secure, HttpOnly"
              />
            </div>
          </div>
          <p>
            Security cookies are classified as strictly necessary. They do not
            contain personally identifiable information and are used exclusively
            for platform security purposes.
          </p>
        </LegalSection>

        <LegalSection
          id="preference-cookies"
          title="6. Preference & UI Cookies"
        >
          <p>
            Preference cookies store user interface settings selected by the
            user during their session. These cookies improve usability by
            remembering the user's display preferences between visits.
          </p>
          <div className="mt-4 rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 px-4 py-2 bg-muted/60 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border/60">
              <span>Cookie Name</span>
              <span>Purpose</span>
              <span>Duration</span>
              <span>Type</span>
            </div>
            <div className="px-4">
              <CookieRow
                name="ev-theme"
                purpose="Stores the user's chosen display theme (light or dark mode) to maintain a consistent visual environment across sessions."
                duration="365 days"
                type="First-party"
              />
              <CookieRow
                name="session-preference"
                purpose="Stores the user's session duration preference (e.g., keep logged in vs. session-only login) as selected during the login process."
                duration="30 days"
                type="First-party, Secure, HttpOnly"
              />
            </div>
          </div>
        </LegalSection>

        <LegalSection id="analytics-cookies" title="7. Analytics Cookies">
          <p>
            Medivance does not currently use third-party analytics cookies or
            tracking scripts that transmit user data to external parties. Any
            internal analytics capabilities within the platform (such as the
            administrator analytics dashboard) operate exclusively on
            server-side data aggregation and do not set browser-level tracking
            cookies.
          </p>
          <p>
            If analytics cookies are introduced in a future platform update,
            this policy will be updated accordingly and institutional
            administrators will be notified in advance. Any analytics
            functionality will be implemented in a manner consistent with
            applicable healthcare privacy regulations and will not process
            patient data.
          </p>
        </LegalSection>

        <LegalSection
          id="no-third-party"
          title="8. No Third-Party Advertising Cookies"
        >
          <p>
            Medivance does not integrate with any advertising networks, social
            media platforms, or behavioral tracking services. No third-party
            cookies are set by or shared with advertisers, data brokers, or
            marketing platforms through this application.
          </p>
          <p>
            Users should be aware that their network infrastructure (such as
            corporate proxy servers or browser extensions installed on their
            workstation) may independently set cookies outside of Medivance's
            control. These are not Medivance cookies and are not governed by
            this policy.
          </p>
        </LegalSection>

        <LegalSection id="managing-cookies" title="9. Managing Cookies">
          <p>
            Because the cookies used by Medivance are strictly necessary for
            platform authentication and security, it is not possible to opt out
            of these cookies while continuing to use the platform. Disabling
            authentication and session cookies in your browser will prevent you
            from logging in.
          </p>
          <p>
            Preference cookies (such as theme settings) may be cleared without
            affecting platform access; however, your saved preferences will be
            lost. You can clear cookies in your browser settings, but note that
            doing so will terminate your active session and require you to log
            in again.
          </p>
          <p>
            For guidance on managing cookies in your specific browser, refer to
            your browser's official documentation or support pages. Your
            Institution's IT department can also provide guidance on cookie
            management in your clinical workstation environment.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="10. Changes to This Policy">
          <p>
            Medivance may update this Cookie Policy if new cookies are
            introduced or existing cookies are changed. Changes will be
            reflected with an updated "Last Updated" date at the top of this
            document. Institutional administrators will be notified of material
            changes.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="11. Contact">
          <div className="mt-2 p-5 bg-muted/40 rounded-xl border border-border/60 space-y-2">
            <p className="font-medium text-foreground">
              Medivance — Privacy & Compliance
            </p>
            <p>For questions about this Cookie Policy:</p>
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
