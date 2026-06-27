"use client";

import { Forget_password_Steps } from "@/lib/constants/auth.constant";
import { ForgetPasswordSteps } from "@/lib/types/auth";
import { useState } from "react";
import EmailStep from "@/features/auth/components/forgot-password/email-step";
import ForgotPasswordForm from "@/features/auth/components/forgot-password/forgot-password-form";
import ResetPasswordForm from "@/features/auth/components/reset-password/reset-password-form";
import { useRouter } from "next/navigation";

// component
export default function ForgotPasswordLayout() {
  // hooks
  const Router = useRouter();
  const [step, setStep] = useState<ForgetPasswordSteps>(
    Forget_password_Steps.Email,
  );
  const [email, setEmail] = useState<string | null>(null);
  const [token] = useState<string | null>(null);

  // steps
  const steps = {
    [Forget_password_Steps.Email]: (
      <EmailStep
        setStep={setStep}
        setEmail={setEmail}
        onBack={() => Router.push("/login")}
      />
    ),
    [Forget_password_Steps.forgot_password]: (
      <ForgotPasswordForm
        email={email || ""}
        onBack={() => setStep(Forget_password_Steps.Email)}
      />
    ),
    [Forget_password_Steps.New_Password]: (
      <ResetPasswordForm token={token || ""} />
    ),
  };

  return <div>{steps[step]}</div>;
}
