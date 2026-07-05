"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changePasswordAdminAction,
  changePasswordDoctorAction,
} from "../actions/profile.actions";
import type { ChangePasswordFormValues } from "@/lib/shared/schemas/settings.schema";

type PasswordVariant = "admin" | "doctor";

export function useChangePassword(variant: PasswordVariant = "admin") {
  return useMutation({
    mutationFn: (payload: ChangePasswordFormValues) =>
      variant === "doctor"
        ? changePasswordDoctorAction(payload)
        : changePasswordAdminAction(payload),
    onSuccess: (data) => {
      const successMessage =
        data.message === "Password changed successfully" || data.success;

      if (successMessage) {
        toast.success("Password changed successfully!");
        return;
      }

      if (data.field === "current_password") {
        toast.error("Current password is incorrect");
        return;
      }

      toast.error(data.message || "Something went wrong");
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
