"use server";

import * as usersApi from "../api/users.api";
import type {
  AddUserPayload,
  InactiveUsersListResponse,
  MutationResponse,
  UpdateUserPayload,
  UsersListResponse,
} from "@/lib/types/admin";

export type { DeactivatedPatient } from "../api/users.api";

// Users active actions
export async function getActiveUsersAction(
  filters?: Parameters<typeof usersApi.fetchActiveUsers>[0],
): Promise<UsersListResponse> {
  return usersApi.fetchActiveUsers(filters);
}

// Inactive users actions
export async function getInactiveUsersAction(
  filters?: Parameters<typeof usersApi.fetchInactiveUsers>[0],
): Promise<InactiveUsersListResponse> {
  return usersApi.fetchInactiveUsers(filters);
}

// Add User actions
export async function addUserAction(
  payload: AddUserPayload,
): Promise<MutationResponse> {
  return usersApi.createUser(payload);
}

// Update User actions
export async function updateUserAction(
  id: number,
  payload: UpdateUserPayload,
): Promise<MutationResponse> {
  return usersApi.updateUser(id, payload);
}

// Delete User actions
export async function deleteUserAction(id: number): Promise<MutationResponse> {
  return usersApi.deleteUser(id);
}

// Deactivate User actions
export async function deactivateUserAction(
  id: number,
): Promise<MutationResponse> {
  return usersApi.deactivateUser(id);
}

// Reactivate User actions
export async function reactivateUserAction(
  id: number,
): Promise<MutationResponse> {
  return usersApi.reactivateUser(id);
}

// Transfer Patients actions
export async function transferPatientsAction(
  oldDoctor: number,
  newDoctor: number,
): Promise<MutationResponse> {
  return usersApi.transferPatients(oldDoctor, newDoctor);
}

// Users actions related to doctors
export async function getDoctorsAction() {
  return usersApi.fetchDoctors();
}

// Deactivated Patients actions
export async function getDeactivatedPatientsAction(
  filters?: Parameters<typeof usersApi.fetchDeactivatedPatients>[0],
) {
  return usersApi.fetchDeactivatedPatients(filters);
}

// Reactivate Patient actions
export async function reactivatePatientAction(national_id: string) {
  return usersApi.reactivatePatient(national_id);
}

// Get patients of doctor
export async function getPatientsOfDoctorAction() {
  return usersApi.fetchPatientsOfDoctor();
}