import Link from "next/link";
import { Shield, FileText, Cookie, Lock } from "lucide-react";

export const metadata = {
  title: "Legal & Compliance | Medivance",
  description:
    "Medivance legal documents, privacy policy, terms of use, and compliance information.",
};

const legalDocuments = [
  {
    icon: Shield,
    title: "Privacy Policy",
    description:
      "How we collect, handle, and protect patient health information, DICOM imaging data, radiology reports, and user account data.",
    href: "/legal/privacy-policy",
    badge: "Required Reading",
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description:
      "User responsibilities, account rules, acceptable use, intellectual property, liability limitations, and governing law.",
    href: "/legal/terms-and-conditions",
    badge: "Required Reading",
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    description:
      "The limited set of authentication, session, and security cookies used by the platform and how to manage them.",
    href: "/legal/cookie-policy",
    badge: null,
  },
  {
    icon: Lock,
    title: "Security & Data Protection",
    description:
      "Encryption standards, access controls, audit logging, backup procedures, and patient confidentiality practices.",
    href: "/legal/security-policy",
    badge: null,
  },
];

export default function LegalIndexPage() {
  return (
    <>
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-800 dark:bg-emerald-400" />
          Legal & Compliance
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Legal Documents
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          All legal, privacy, and compliance documentation governing the use of
          Medivance. These documents apply to all authorized users of the
          platform including administrators, physicians, and administrative
          staff.
        </p>
      </div>

      <div className="grid gap-4">
        {legalDocuments.map((doc) => {
          const Icon = doc.icon;
          return (
            <Link
              key={doc.href}
              href={doc.href}
              className="group flex items-start gap-5 p-5 rounded-xl border border-border/60 bg-card hover:border-emerald-800/30 hover:bg-muted/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 transition-colors">
                <Icon className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {doc.title}
                  </span>
                  {doc.badge && (
                    <span className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/50">
                      {doc.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {doc.description}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-muted-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 p-5 bg-muted/40 rounded-xl border border-border/60">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Questions about these documents?
          </span>{" "}
          Contact the Medivance compliance team at{" "}
          <a
            href="mailto:amr540290@gmail.com"
            className="text-emerald-800 dark:text-emerald-400 hover:underline"
          >
            legal@evplatform.health
          </a>{" "}
          or your institution's designated Privacy Officer.
        </p>
      </div>
    </>
  );
}
