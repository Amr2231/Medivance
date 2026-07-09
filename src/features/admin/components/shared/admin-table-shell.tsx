"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { fadeUp } from "@/lib/motion/variants";

type AdminTableShellProps = {
  children: ReactNode;
  isFetching?: boolean;
  className?: string;
};

// component
export function AdminTableShell({
  children,
  isFetching,
  className,
}: AdminTableShellProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={cn(
        "rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 overflow-hidden transition-[opacity,box-shadow] duration-200 hover:shadow-glow-sm",
        isFetching && "opacity-70",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </motion.div>
  );
}

// component
export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
        {children}
      </tr>
    </thead>
  );
}
