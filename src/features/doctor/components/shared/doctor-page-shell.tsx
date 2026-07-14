"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

type DoctorPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function DoctorPageShell({
  title,
  description,
  children,
  actions,
}: DoctorPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="max-w-350 mx-auto space-y-6"
      >
        <motion.div
          variants={staggerItem}
          className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="relative pl-4">
            <span
              aria-hidden
              className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[image:var(--brand-gradient)]"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-6">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
