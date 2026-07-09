"use client";

import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerItem } from "@/lib/motion/variants";

// types
type MetricCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
  danger?: boolean;
  sublabel?: string;
};

/** Counts up from 0 to `value` once it scrolls into view. Falls back to
 * rendering the raw value immediately for non-numeric values. */
function AnimatedValue({ value }: { value: number | string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const numeric = typeof value === "number" ? value : Number(value);
  const isNumeric = Number.isFinite(numeric);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 22 });

  useEffect(() => {
    if (isNumeric && isInView) motionValue.set(numeric);
  }, [isInView, isNumeric, numeric, motionValue]);

  useEffect(() => {
    if (!ref.current || !isNumeric) return;
    const unsub = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString();
    });
    return unsub;
  }, [spring, isNumeric]);

  if (!isNumeric) {
    return <p ref={ref}>{value}</p>;
  }

  return <p ref={ref}>0</p>;
}

// main
export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  danger,
  sublabel,
}: MetricCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "rounded-xl border p-4 flex items-center gap-4 transition-shadow duration-200",
        danger
          ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 hover:shadow-[0_8px_24px_-10px_rgba(220,38,38,0.35)]"
          : "border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hover:shadow-glow-md",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg shrink-0",
          danger
            ? "bg-red-100 dark:bg-red-900/40"
            : (accent ?? "bg-[image:var(--brand-gradient-soft)]"),
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5",
            danger ? "text-red-600" : "text-gray-600 dark:text-gray-300",
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <div
          className={cn(
            "text-2xl font-semibold tabular-nums",
            danger
              ? "text-red-700 dark:text-red-400"
              : "text-gray-900 dark:text-gray-100",
          )}
        >
          <AnimatedValue value={value} />
        </div>
        {sublabel && (
          <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}
