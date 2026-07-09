import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerContainer } from "@/lib/motion/variants";

// types
type AnalyticsLayoutProps = {
  filters?: ReactNode;
  kpis?: ReactNode;
  children: ReactNode;
  className?: string;
};

type MetricGridProps = {
  children: ReactNode;
  cols?: 2 | 3 | 4;
};

// component
export function AnalyticsLayout({
  filters,
  kpis,
  children,
  className,
}: AnalyticsLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {filters}

      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

// component
export function MetricGrid({ children, cols = 4 }: MetricGridProps) {
  const colClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
      className={cn("grid gap-4", colClass)}
    >
      {children}
    </motion.div>
  );
}
