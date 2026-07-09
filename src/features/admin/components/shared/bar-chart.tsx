"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";

// types
type BarChartProps = {
  title: string;
  subtitle?: string;
  data: { label: string; value: number }[];
  color?: string;
  className?: string;
};

// component
export function BarChart({
  title,
  subtitle,
  data,
  color = "bg-teal-600",
  className,
}: BarChartProps) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4",
        className,
      )}
    >
      {/* header */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {/* bars */}
      <div className="flex items-end flex-1 gap-3 h-72">
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 flex flex-col items-center gap-1 min-w-0"
          >
            {/* value */}
            <span className="text-xs text-gray-400 tabular-nums">
              {d.value}
            </span>
            <div
              className="w-full flex items-end justify-center"
              style={{ height: 80 }}
            >
              <motion.div
                className={cn(
                  "w-full rounded-t hover:opacity-90",
                  color === "bg-teal-600"
                    ? "bg-[image:var(--brand-gradient)]"
                    : color,
                )}
                initial={{ height: 0 }}
                animate={{ height: Math.max(4, (d.value / max) * 80) }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 16,
                  delay: i * 0.04,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 truncate w-full text-center">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type MiniBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
};

export function MiniBar({
  label,
  value,
  max,
  color = "bg-teal-600",
}: MiniBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums w-8 text-right">
        {value}
      </span>
    </div>
  );
}
