"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateProfileAction } from "../actions/profile.actions";
import type { PersonalInfoFormValues } from "@/lib/shared/schemas/settings.schema";
import type { UpdateProfileResponse } from "../api/profile.api";
import { useRouter } from "next/navigation";

function handleProfileResponse(
  data: UpdateProfileResponse,
  onSessionUpdate?: () => Promise<void>,
) {
  if (data.id) {
    toast.success("Profile updated successfully!");
    void onSessionUpdate?.();
    return;
  }

  if (data.field === "email") {
    toast.error("This email address is already in use");
    return;
  }

  if (data.field === "username") {
    toast.error("This username is already taken");
    return;
  }

  if (data.success === false) {
    toast.error(data.message ?? "Failed to update profile");
    return;
  }

  toast.error(data.message || "Something went wrong");
}

export function useUpdateProfile() {
  const { update } = useSession();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PersonalInfoFormValues) =>
      updateProfileAction(payload),
    onSuccess: async (data) => {
      await handleProfileResponse(data, async () => {
        if (data.id) {
          const firstName = data.first_name ?? data.First_name ?? "";
          const lastName = data.last_name ?? data.Last_name ?? "";
          await update({
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            username: data.username,
            email: data.email,
          });
          router.refresh();
        }
      });
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
