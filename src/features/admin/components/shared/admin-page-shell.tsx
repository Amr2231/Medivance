"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

// types
type AdminPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

// component
export function AdminPageShell({
  title,
  description,
  actions,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
      className={cn("p-6 space-y-6", className)}
    >
      <motion.div
        variants={staggerItem}
        className="flex flex-col items-start justify-between gap-4"
      >
        <div className="relative pl-4">
          <span
            aria-hidden
            className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[image:var(--brand-gradient)]"
          />
          {/* title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>

          {/* description */}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* actions */}
        {actions && <div className="shrink-0">{actions}</div>}
      </motion.div>
      <motion.div variants={fadeUp} className="space-y-6">
        {children}
      </motion.div>
    </motion.div>
  );
}
