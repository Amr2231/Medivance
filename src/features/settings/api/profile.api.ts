import { serverFetch } from "@/lib/shared/api/server-client";
import type { PersonalInfoFormValues } from "@/lib/shared/schemas/settings.schema";

export type UpdateProfileResponse = {
  id?: number;
  first_name?: string;
  last_name?: string;
  First_name?: string;
  Last_name?: string;
  username?: string;
  email?: string;
  success?: boolean;
  message?: string;
  error?: string;
  field?: string;
};

export type ChangePasswordResponse = {
  success?: boolean;
  message?: string;
  field?: string;
};

export async function updateProfile(
  payload: PersonalInfoFormValues,
): Promise<UpdateProfileResponse> {
  return serverFetch<UpdateProfileResponse>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function changePassword(
  payload: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  },
  variant: "admin" | "doctor" = "admin",
): Promise<ChangePasswordResponse> {
  const body =
    variant === "admin"
      ? {
          current_password: payload.current_password,
          new_password: payload.new_password,
          confirm_new_password: payload.confirm_password,
        }
      : payload;

  const method = variant === "admin" ? "PATCH" : "POST";

  return serverFetch<ChangePasswordResponse>("/auth/change-password", {
    method,
    body: JSON.stringify(body),
  });
}

export type DeleteAccountResponse = {
  success?: boolean;
  message?: string;
};

export async function deleteAccount(
  password: string,
): Promise<DeleteAccountResponse> {
  return serverFetch<DeleteAccountResponse>("/users/profile", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}
