import { sendResetLinkAction } from "@/features/auth/actions/auth.actions";
import { EmailStepFields } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";

export default function useEmail() {
  // Mutation
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (fields: EmailStepFields) => {
      const payload = await sendResetLinkAction(fields);
      return payload;
    },
  });
  return { isPending, error, sendOtp: mutate };
}
