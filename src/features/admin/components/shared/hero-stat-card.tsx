"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerItem } from "@/lib/motion/variants";

type HeroStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** Small line under the value, e.g. "currently active" or "+12 new today" */
  sublabel?: string;
  /** Secondary line under the progress bar / sublabel */
  footnote?: string;
  /** 0-100 — renders a progress bar under the value when provided */
  progress?: number;
  danger?: boolean;
};

export function HeroStatCard({
  label,
  value,
  icon: Icon,
  sublabel,
  footnote,
  progress,
  danger,
}: HeroStatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "rounded-xl border p-5 transition-shadow duration-200",
        danger
          ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
          : "border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hover:shadow-glow-md",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div
          className={cn(
            "p-1.5 rounded-lg shrink-0",
            danger
              ? "bg-red-100 dark:bg-red-900/40"
              : "bg-[image:var(--brand-gradient-soft)]",
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              danger ? "text-red-600" : "text-emerald-800 dark:text-emerald-300",
            )}
          />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={cn(
            "text-3xl font-bold tabular-nums",
            danger
              ? "text-red-700 dark:text-red-400"
              : "text-gray-900 dark:text-gray-100",
          )}
        >
          {value}
        </span>
        {sublabel && (
          <span className="text-xs text-gray-500 truncate">{sublabel}</span>
        )}
      </div>

      {progress != null && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[image:var(--brand-gradient)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>
      )}

      {footnote && (
        <p className="text-[11px] text-gray-400 mt-2">{footnote}</p>
      )}
    </motion.div>
  );
}
