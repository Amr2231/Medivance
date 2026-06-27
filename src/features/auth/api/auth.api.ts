import { JSON_HEADERS } from "@/lib/shared/constants/api";
import { serverFetch } from "@/lib/shared/api/server-client";
import { getPublicApiUrl } from "@/lib/shared/config/env";
import { getServerApiUrl } from "@/lib/shared/config/env";
import type { MutationResponse } from "@/lib/types/admin";

// reset link actions
export async function sendResetLink(fields: { email: string }) {
  const response = await fetch(`${getServerApiUrl()}/auth/forgot-password`, {
    method: "POST",
    headers: { ...JSON_HEADERS },
    body: JSON.stringify(fields),
  });
  return response.json() as Promise<ApiResponse<null>>;
}

// reset password action
export async function resetPassword(fields: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${getPublicApiUrl()}/auth/reset-password`, {
    method: "POST",
    headers: { ...JSON_HEADERS },
    body: JSON.stringify(fields),
  });
  const payload: ApiResponse<null> = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Something went wrong");
  }
  return payload;
}

// change password action
export async function changePassword(payload: {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}): Promise<MutationResponse> {
  return serverFetch<MutationResponse>("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
