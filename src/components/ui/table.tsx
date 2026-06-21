"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils/tailwind-merge";
import { rowEnter } from "@/lib/motion/variants";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-gray-200 dark:[&_tr]:border-gray-700",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-gray-200 bg-gray-50 font-medium dark:border-gray-700 dark:bg-gray-800/50 [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-gray-200 transition-colors dark:border-gray-700/60",
        "hover:bg-gray-50 dark:hover:bg-gray-700/30",
        "has-aria-expanded:bg-gray-50 dark:has-aria-expanded:bg-gray-700/30",
        "data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-700/50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Animated row — same look as TableRow, but fades/slides in on mount and
 * is meant to be used inside a `motion` stagger context (e.g. wrap
 * TableBody's rows with AnimatePresence, or just rely on each row's own
 * mount animation for paginated/filtered lists re-rendering).
 */
function MotionTableRow({ className, ...props }: HTMLMotionProps<"tr">) {
  return (
    <motion.tr
      data-slot="table-row"
      variants={rowEnter}
      initial="hidden"
      animate="show"
      layout
      className={cn(
        "border-b border-gray-200 transition-colors dark:border-gray-700/60",
        "hover:bg-gray-50 dark:hover:bg-gray-700/30",
        "has-aria-expanded:bg-gray-50 dark:has-aria-expanded:bg-gray-700/30",
        "data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-700/50",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
        "text-gray-600 dark:text-gray-400",
        "bg-gray-100 dark:bg-gray-800",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap",
        "text-gray-900 dark:text-gray-200",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  MotionTableRow,
  TableCell,
  TableCaption,
};
