"use server";

import { changePassword, deleteAccount, updateProfile } from "../api/profile.api";
import type { PersonalInfoFormValues } from "@/lib/shared/schemas/settings.schema";

export async function updateProfileAction(payload: PersonalInfoFormValues) {
  return updateProfile(payload);
}

export async function changePasswordAdminAction(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  return changePassword(payload, "admin");
}

export async function changePasswordDoctorAction(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  return changePassword(payload, "doctor");
}

export async function deleteAccountAction(password: string) {
  return deleteAccount(password);
}
