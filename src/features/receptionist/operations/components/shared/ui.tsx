"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  DOCTOR_STATUS_COLORS,
} from "../../constants";

type BadgeProps = {
  label: string;
  className?: string;
};

export function StatusBadge({ label, className }: BadgeProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[label] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {label}
    </motion.span>
  );
}

export function PriorityBadge({ label, className }: BadgeProps) {
  const isCritical = /critical|urgent|high/i.test(label);
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        PRIORITY_COLORS[label] ?? PRIORITY_COLORS.Normal,
        className,
      )}
    >
      {isCritical && (
        <span className="absolute -left-0.5 -top-0.5 size-1.5 rounded-full bg-red-500 animate-ping" />
      )}
      {label}
    </motion.span>
  );
}

export function DoctorStatusBadge({ label, className }: BadgeProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        DOCTOR_STATUS_COLORS[label] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {label}
    </motion.span>
  );
}

export { MetricCard } from "@/features/admin/components/shared/metric-card";
export { MetricGrid } from "@/features/admin/components/shared/analytics-layout";
export { TableToolbar } from "@/features/admin/components/shared/table-toolbar";
export { AdminLoadingState as ReceptionLoadingState } from "@/features/admin/components/shared/admin-loading-state";
export {
  BarChart,
  MiniBar,
} from "@/features/admin/components/shared/bar-chart";
