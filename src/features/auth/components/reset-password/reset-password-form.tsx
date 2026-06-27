"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { MoveRight, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SubmissionFeedback from "@/components/shared/submission-feedback";
import useResetPassword from "../../hooks/use-reset-password";
import { resetSchema, ResetFields } from "@/lib/schemas/auth.schema";

// component
export default function ResetPasswordForm({ token }: { token: string }) {
  // hooks
  const { isPending, error, success, resetPassword } = useResetPassword(token);

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // onsubmit handler
  const onSubmit = (data: ResetFields) => resetPassword(data);

  if (!token) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        {/* title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Invalid Link
        </h1>

        {/* description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This reset link is invalid or has expired.
        </p>

        {/* request new link */}
        <Link
          href="/forgot-password"
          className="text-red-800 hover:text-red-900 font-medium hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        className="w-full max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Success icon */}
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 mx-auto">
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

        {/* title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Password Reset!
        </h1>

        {/* description */}
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Your password has been changed successfully.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Redirecting to login...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back link */}
      <Link
        href="/login"
        className="flex items-center gap-2 mb-4 -ml-2 text-gray-600 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-emerald-400 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-800 dark:text-emerald-400" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password */}
        <div className="space-y-2">
          <Label>New Password</Label>
          <PasswordInput
            placeholder="Enter new password"
            {...register("password")}
            error={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-800">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <PasswordInput
            placeholder="Confirm new password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-800">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Error Feedback */}
        <SubmissionFeedback>{(error as Error)?.message}</SubmissionFeedback>

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Resetting..." : "Reset Password"}
          {!isPending && <MoveRight className="w-4 h-4" />}
        </Button>
      </form>
    </motion.div>
  );
}
