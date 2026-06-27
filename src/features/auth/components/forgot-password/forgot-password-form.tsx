"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// types
type ForgotPasswordFormProps = {
  email: string;
  onSuccess?: (token: string) => void;
  onBack: () => void;
};

// component
export default function ForgotPasswordForm({ email }: ForgotPasswordFormProps) {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-emerald-700 dark:text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Check your email
      </h1>

      {/* description */}
      <p className="text-gray-500 dark:text-gray-400 mb-1.5">
        We sent a password reset link to:{" "}
        <span className="font-bold text-emerald-800 dark:text-emerald-400">
          {email}
        </span>
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
        The link expires in 15 minutes. If you don&apos;t see it, check your
        spam folder.
      </p>

      {/* back to login link */}
      <Link
        href="/login"
        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
    </motion.div>
  );
}
