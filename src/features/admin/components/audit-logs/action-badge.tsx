import { cn } from "@/lib/utils/tailwind-merge";
import type { AuditAction } from "@/lib/types/audit-logs";

// styles for action
const actionStyles: Record<string, string> = {
  LOGIN: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  LOGOUT: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
  AI_RUN: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
  AI_APPROVE: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  AI_REJECT: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  AI_EDIT: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  REPORT_SIGNED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  IMAGE_UPLOAD: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800",
  PATIENT_REGISTER: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
  PATIENT_UPDATE: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800",
  PATIENT_DEACTIVATE: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
  DOCTOR_REASSIGN: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
  USER_CREATE: "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-400 dark:border-lime-800",
  USER_DEACTIVATE: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
  USER_REACTIVATE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  PATIENTS_TRANSFER: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
};

// default style
const defaultStyle =
  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700";

  // types
type ActionBadgeProps = {
  action: AuditAction | string;
  className?: string;
};

// component
export function ActionBadge({ action, className }: ActionBadgeProps) {
  const label = action.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        actionStyles[action] ?? defaultStyle,
        className,
      )}
    >
      {label}
    </span>
  );
}
