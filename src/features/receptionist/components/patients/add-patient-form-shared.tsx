"use client";

// Small, dumb presentational pieces shared by the add-patient form.
// Split out of add-patient-form.tsx (was 477 lines in one file).

import { motion } from "motion/react";

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700  dark:bg-gray-900 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 ">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100/10 dark:bg-emerald-900/20">
          <Icon className="w-4 h-4 text-emerald-800" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 ">{title}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label} {required && <span className="text-emerald-800">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}
