import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { AuditSeverity } from "../../constants/audit-logs.constants";

const SEVERITY_CONFIG: Record<
  AuditSeverity,
  { label: string; className: string; icon: typeof Info }
> = {
  critical: {
    label: "CRITICAL",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    icon: AlertOctagon,
  },
  warn: {
    label: "WARN",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    icon: AlertTriangle,
  },
  info: {
    label: "INFO",
    className:
      "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
    icon: Info,
  },
};

export function AuditSeverityBadge({
  severity,
  className,
}: {
  severity: AuditSeverity;
  className?: string;
}) {
  const { label, className: styles, icon: Icon } = SEVERITY_CONFIG[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap",
        styles,
        className,
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
