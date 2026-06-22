"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { pageTransition } from "@/lib/motion/variants";

/**
 * Wraps a role's route content so every page navigation gets a soft
 * fade/rise instead of an abrupt swap. Used from `app/<role>/template.tsx`,
 * which Next.js remounts on every navigation (unlike `layout.tsx`), so
 * `pathname` changing is exactly what re-triggers the "show" animation.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageTransition}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
