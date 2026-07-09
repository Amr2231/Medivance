import { cn } from "@/lib/utils/tailwind-merge";
import type { AuditEntity } from "@/lib/types/audit-logs";

// styles for entity
const entityStyles: Record<string, string> = {
  User: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
  Patient:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
  Study:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
  Report:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
};

// default style
const defaultStyle =
  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700";

// types
type EntityBadgeProps = {
  entity: AuditEntity | string;
  className?: string;
};

// component
export function EntityBadge({ entity, className }: EntityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        entityStyles[entity] ?? defaultStyle,
        className,
      )}
    >
      {entity}
    </span>
  );
}
