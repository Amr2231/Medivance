"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, type LucideIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils/tailwind-merge";

export type MobileNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

type MobileBottomNavProps = {
  items: MobileNavItem[];
  unreadCount?: number;
  moreLabel?: string;
  className?: string;
};

/**
 * Fixed bottom tab bar shown on small screens instead of the off-canvas
 * sidebar sheet. Renders the most important nav items as icon+label tabs,
 * plus a trailing "More" tab that opens the full sidebar sheet for the
 * rest of the navigation.
 */
export function MobileBottomNav({
  items,
  unreadCount = 0,
  moreLabel = "More",
  className,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <nav
      data-slot="mobile-bottom-nav"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border/60 bg-background/95 backdrop-blur-md shadow-[0_-1px_8px_rgba(0,0,0,0.04)] md:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.url ||
          (!item.exact && pathname.startsWith(item.url + "/"));
        const Icon = item.icon;

        return (
          <Link
            key={item.url}
            href={item.url}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 min-w-0"
          >
            <span
              className={cn(
                "relative flex items-center justify-center size-8 rounded-full transition-colors",
                isActive
                  ? "bg-emerald-800 text-white shadow-sm shadow-emerald-800/30"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {item.badge === "chat" && unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] leading-none font-bold flex items-center justify-center px-0.5 ring-2 ring-background">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-[10px] leading-none truncate max-w-full px-0.5",
                isActive
                  ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground font-medium",
              )}
            >
              {item.title}
            </span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => setOpenMobile(true)}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 min-w-0"
      >
        <span className="flex items-center justify-center size-8 rounded-full text-muted-foreground">
          <LayoutGrid className="size-4.5 shrink-0" />
        </span>
        <span className="text-[10px] leading-none font-medium text-muted-foreground truncate max-w-full px-0.5">
          {moreLabel}
        </span>
      </button>
    </nav>
  );
}
