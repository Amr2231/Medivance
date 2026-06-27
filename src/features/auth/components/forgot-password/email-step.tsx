"use client";

import { motion } from "framer-motion";
import { User, MoveRight, ArrowLeft, KeyRound } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgetPasswordSteps } from "@/lib/types/auth";
import { Forget_password_Steps } from "@/lib/constants/auth.constant";
import { EmailStepFields } from "@/lib/types/auth";
import { emailStepSchema } from "@/lib/schemas/auth.schema";
import useEmail from "@/features/auth/hooks/use-send-otp";
import SubmissionFeedback from "@/components/shared/submission-feedback";

// types
interface EmailStepProps {
  setStep: Dispatch<SetStateAction<ForgetPasswordSteps>>;
  setEmail: Dispatch<SetStateAction<string | null>>;
  onBack: () => void;
}

// component
export default function EmailStep({
  setStep,
  setEmail,
  onBack,
}: EmailStepProps) {
  // hooks
  const { isPending, error, sendOtp } = useEmail();

  // form
  const form = useForm<EmailStepFields>({
    resolver: zodResolver(emailStepSchema()),
    defaultValues: { email: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // onsubmit handler
  const onSubmit: SubmitHandler<EmailStepFields> = (values) => {
    sendOtp(values, {
      onSuccess: () => {
        setStep(Forget_password_Steps.forgot_password);
        setEmail(values.email);
      },
    });
  };

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2 mb-4 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
            <KeyRound className="w-4.5 h-4.5 text-emerald-800 dark:text-emerald-400" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Forgot password?
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>

      {/* form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

        {/* Submission feedback */}
        <SubmissionFeedback>{error?.message}</SubmissionFeedback>

        {/* continue */}
        <Button
          variant="default"
          disabled={isPending || !form.formState.isValid}
          type="submit"
          className="w-full"
        >
          Continue <MoveRight className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
}
