"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/lib/motion/variants";

type SettingsSectionCardProps = {
  title: string;
  id?: string;
  children: React.ReactNode;
};

export function slugifySettingsTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SettingsSectionCard({
  title,
  id,
  children,
}: SettingsSectionCardProps) {
  return (
    <motion.div
      id={id ?? slugifySettingsTitle(title)}
      variants={staggerItem}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 overflow-hidden p-4 sm:p-6 space-y-5 transition-shadow duration-300 hover:shadow-glow-sm scroll-mt-24"
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}
