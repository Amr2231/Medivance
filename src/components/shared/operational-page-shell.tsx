"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

export function OperationalPageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 p-10"
    >
      <motion.div
        variants={staggerItem}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative pl-4">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-[image:var(--brand-gradient)]"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </motion.div>
      <motion.div variants={fadeUp} className="flex flex-col gap-6">
        {children}
      </motion.div>
    </motion.div>
  );
}
