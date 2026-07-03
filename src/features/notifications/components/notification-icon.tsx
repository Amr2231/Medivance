import {
  Bell,
  FileText,
  RefreshCw,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { NotificationCategory } from "@/lib/types/notifications";

const iconConfig: Record<
  NotificationCategory,
  { icon: typeof Bell; className: string }
> = {
  patient: {
    icon: User,
    className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  report: {
    icon: FileText,
    className:
      "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  system: {
    icon: RefreshCw,
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
};

type NotificationIconProps = {
  category: NotificationCategory;
  size?: "sm" | "md";
  className?: string;
};

export function NotificationIcon({
  category,
  size = "md",
  className,
}: NotificationIconProps) {
  const config = iconConfig[category];
  const Icon = config.icon;
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full shrink-0",
        sizeClass,
        config.className,
        className,
      )}
    >
      <Icon className={iconSize} />
    </div>
  );
}
