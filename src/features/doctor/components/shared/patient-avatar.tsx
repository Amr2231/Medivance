import { cn } from "@/lib/utils/tailwind-merge";

// Colored circle per study type — same idea as the admin Users table's
// per-role avatar (ROLE_AVATAR_STYLES), just keyed on study instead of role
// so every patient table gets the same quick visual anchor the admin table has.
const STUDY_AVATAR_STYLES: Record<string, string> = {
  CT: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  Echo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  MRI: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Mammogram:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};
const FALLBACK_STYLE =
  "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400";

export function PatientAvatar({
  firstName,
  lastName,
  study,
  className,
}: {
  firstName?: string | null;
  lastName?: string | null;
  study?: string | null;
  className?: string;
}) {
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  const style = (study && STUDY_AVATAR_STYLES[study]) || FALLBACK_STYLE;

  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        style,
        className,
      )}
    >
      {initials || "—"}
    </span>
  );
}
