"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { deleteAccountAction } from "../actions/profile.actions";

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => deleteAccountAction(password),
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Your account has been deleted");
        await signOut({ callbackUrl: "/login" });
        return;
      }

      toast.error(data.message || "Unable to delete account");
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
