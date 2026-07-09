import { cn } from "@/lib/utils/tailwind-merge";
import type { Role } from "@/lib/types/admin";

// styles
const ROLE_STYLES: Record<string, string> = {
  Doctor:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  Receptionist:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
  Admin:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
};

// types
type RoleBadgeProps = {
  role: Role | string;
  className?: string;
};

// component
export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        ROLE_STYLES[role] ??
          "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400",
        className,
      )}
    >
      {role}
    </span>
  );
}
