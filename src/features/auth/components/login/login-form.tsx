"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Stethoscope } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { LoginFields } from "@/lib/types/auth";
import { useLogin } from "@/features/auth/hooks/use-login";
import SubmissionFeedback from "@/components/shared/submission-feedback";
import { LegalTermsModal } from "@/components/shared/legal-terms-modal";

export default function LoginForm() {
  // hooks
  const { isPending, error, login } = useLogin();
  const [termsOpen, setTermsOpen] = useState(false);

  // form
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      agreeToTerms: false,
    },
  });

  // destructure
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // onsubmit handler
  const onSubmit: SubmitHandler<LoginFields> = (values) => {
    login(values);
  };

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
            <Stethoscope className="w-4.5 h-4.5 text-emerald-800 dark:text-emerald-400" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please enter your credentials to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              className="pl-10"
              error={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-800">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-emerald-800 dark:text-emerald-400 text-sm font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 text-gray-400" />
            <PasswordInput
              id="password"
              {...register("password")}
              className="pl-10"
              placeholder="Enter your password"
              error={!!errors.password}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-800">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="remember" className="cursor-pointer font-normal">
                Remember me
              </Label>
            </div>
          )}
        />

        {/* Agree to Terms */}
        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="agree-terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
              <Label
                htmlFor="agree-terms"
                className="cursor-pointer font-normal leading-relaxed"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="text-emerald-800 dark:text-emerald-400 font-medium hover:underline"
                >
                  Terms & Policies
                </button>
              </Label>
            </div>
          )}
        />
        {errors.agreeToTerms && (
          <p className="text-sm text-red-800 -mt-4">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Submission Feedback */}
        <SubmissionFeedback>{error?.message}</SubmissionFeedback>

        {/* Sign in button */}
        <Button
          variant="default"
          disabled={isPending || !form.formState.isValid}
          type="submit"
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      {/* Support link */}
      <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        Need an account?{" "}
        <a
          href="mailto:amr540290@gmail.com"
          className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
        >
          Contact IT Support
        </a>
      </p>

      {/* Legal terms modal, opened from the checkbox label */}
      <LegalTermsModal open={termsOpen} onOpenChange={setTermsOpen} />
    </motion.div>
  );
}
