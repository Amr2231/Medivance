import { cn } from "@/lib/utils/tailwind-merge";

// styles
const SEVERITY_STYLES = {
  low: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400",
  medium:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400",
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400",
} as const;

type Severity = keyof typeof SEVERITY_STYLES;

type SeverityBadgeProps = {
  severity: Severity;
  className?: string;
};

// component
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}

// helper
export function getSeverityFromCount(
  count: number,
  thresholds: { medium: number; high: number; critical: number },
): Severity {
  if (count >= thresholds.critical) return "critical";
  if (count >= thresholds.high) return "high";
  if (count >= thresholds.medium) return "medium";
  return "low";
}
