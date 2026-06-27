import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetPasswordAction } from "../actions/auth.actions";
import { toast } from "sonner";
import { ResetFields } from "@/lib/schemas/auth.schema";

// Custom hook to handle password reset logic
export default function useResetPassword(token: string) {
  // hooks
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  // Mutation hook to handle password reset logic
  const {
    isPending,
    error,
    mutate: resetPassword,
  } = useMutation({
    mutationFn: (fields: ResetFields) =>
      resetPasswordAction({ token, ...fields }),
    // On successful password reset, show success message and redirect to login page
    onSuccess: () => {
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    },
  });
  return { isPending, error, success, resetPassword };
}
