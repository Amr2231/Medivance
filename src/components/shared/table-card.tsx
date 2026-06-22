"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { fadeUp } from "@/lib/motion/variants";

export function TableCard({
  toolbar,
  footer,
  children,
  isFetching,
  className,
}: {
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  isFetching?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white transition-[opacity,box-shadow] duration-200 hover:shadow-glow-sm dark:border-gray-800 dark:bg-gray-950",
        isFetching && "opacity-70",
        className,
      )}
    >
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-100 p-4 dark:border-gray-800">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
