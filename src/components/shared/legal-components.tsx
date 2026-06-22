import { cn } from "@/lib/utils/tailwind-merge";

interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LegalSection({
  id,
  title,
  children,
  className,
}: LegalSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border/60">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

interface LegalPageHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
}

export function LegalPageHeader({
  badge,
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
}: LegalPageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-800 dark:bg-emerald-400" />
        {badge}
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
      <p className="text-muted-foreground text-base leading-relaxed mb-4">
        {subtitle}
      </p>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
        <span>
          <span className="font-medium text-foreground">Effective Date:</span>{" "}
          {effectiveDate}
        </span>
        <span className="text-border">|</span>
        <span>
          <span className="font-medium text-foreground">Last Updated:</span>{" "}
          {lastUpdated}
        </span>
      </div>
    </div>
  );
}

interface LegalTOCProps {
  items: { id: string; label: string }[];
}

export function LegalTOC({ items }: LegalTOCProps) {
  return (
    <nav className="mb-10 p-5 bg-muted/40 rounded-xl border border-border/60">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
        Table of Contents
      </p>
      <ol className="space-y-1.5">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
            >
              <span className="text-xs text-emerald-800/60 dark:text-emerald-400/60 font-mono w-5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
