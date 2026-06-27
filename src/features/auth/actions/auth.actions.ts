"use server";

import * as authApi from "../api/auth.api";
import type { MutationResponse } from "@/lib/types/admin";

// send reset link action
export async function sendResetLinkAction(fields: { email: string }) {
  return authApi.sendResetLink(fields);
}

// reset password action
export async function resetPasswordAction(fields: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  return authApi.resetPassword(fields);
}

// change password action
export async function changePasswordAction(payload: {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}): Promise<MutationResponse> {
  return authApi.changePassword(payload);
}
