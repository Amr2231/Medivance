"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
      className={cn(
        "flex flex-col items-center justify-center py-12 gap-4",
        className,
      )}
    >
      <motion.div
        variants={staggerItem}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-[image:var(--brand-gradient-soft)] shadow-glow-sm"
      >
        <Icon className="w-6 h-6 text-emerald-800 dark:text-emerald-300" />
      </motion.div>
      <motion.div variants={staggerItem} className="text-center">
        <p className="text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">{title}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </motion.div>
    </motion.div>
  );
}

EmptyState.displayName = "EmptyState";