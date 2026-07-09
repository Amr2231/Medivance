import type { MutationResponse } from "@/lib/types/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserAction } from "../actions/users.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAddUser(options?: { onSuccessCallback?: () => void }) {
  // queryClient
  const queryClient = useQueryClient();
  const router = useRouter();

  // useMutation
  return useMutation({
    mutationFn: addUserAction,
    onSuccess: (data: MutationResponse) => {
      const message = data?.message || data?.error || "";
      const msg = message.toLowerCase();

      // duplicate entry for username
      if (msg.includes("duplicate entry") && msg.includes("username")) {
        toast.error("Username already exists");
        return;
      }

      // duplicate entry for email
      if (msg.includes("duplicate entry") && msg.includes("email")) {
        toast.error("Email already exists");
        return;
      }

      // user created
      if (msg.includes("created")) {
        toast.success("User created successfully!");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        if (options?.onSuccessCallback) {
          options.onSuccessCallback();
        } else {
          router.push("/admin/users");
        }
        return;
      }

      toast.error("Something went wrong");
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
