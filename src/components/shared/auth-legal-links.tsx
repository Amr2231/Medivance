import Link from "next/link";

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Conditions", href: "/legal/terms-and-conditions" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
  { label: "Security Policy", href: "/legal/security-policy" },
];

export function AuthLegalLinks() {
  return (
    <nav className="pt-8 border-t border-border/60">
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
        {legalLinks.map((link, i) => (
          <span key={link.href} className="flex items-center gap-3">
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
            {i < legalLinks.length - 1 && (
              <span className="text-border text-xs">·</span>
            )}
          </span>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground/60 mt-3">
        © {new Date().getFullYear()} HealthPortal
      </p>
    </nav>
  );
}
