"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { fadeUp } from "@/lib/motion/variants";

type TableCardProps = {
  /** Search bar / filters / export — rendered in a bordered strip above the table. */
  toolbar?: ReactNode;
  /** Result count / pagination — rendered in a bordered strip below the table. */
  footer?: ReactNode;
  children: ReactNode;
  isFetching?: boolean;
  className?: string;
};

export function TableCard({
  toolbar,
  footer,
  children,
  isFetching,
  className,
}: TableCardProps) {
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
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2.5 p-4 border-b border-gray-100 dark:border-gray-800">
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">{children}</div>

      {footer && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
