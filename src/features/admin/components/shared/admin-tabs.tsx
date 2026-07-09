"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { activeIndicatorTransition } from "@/lib/motion/variants";

// Types
export type AdminTab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

type AdminTabsProps<T extends string> = {
  tabs: AdminTab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

// Component
export function AdminTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: AdminTabsProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-gray-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-gray-800",
        className,
      )}
    >
      {/* Tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium -mb-px transition-colors",
            active === tab.id
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
          )}
        >
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <span className="ml-1.5 text-xs tabular-nums opacity-70">
              ({tab.count})
            </span>
          )}
          {active === tab.id && (
            <motion.span
              layoutId="admin-tab-indicator"
              className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald-600"
              transition={activeIndicatorTransition}
            />
          )}
        </button>
      ))}
    </div>
  );
}
