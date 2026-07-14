"use server";

import {
  getActivePatientByStudyId,
  listActivePatients,
  listHistoricalPatients,
  listRecentPatients,
  updateAssignedPatient,
  getPatientByNationalId,
  getPatientVisitHistory,
  type PatientsListResult,
} from "../services/patients.service";
import type {
  ActivePatient,
  HistoricalPatient,
  MutationResponse,
} from "@/lib/types/doctor";
import type { UpdatePatientPayload } from "@/lib/types/receptionist";
import type {
  ActivePatientsQuery,
  HistoricalPatientsQuery,
} from "../utils/filters";

// get active patients
export async function getActivePatientsAction(
  options?: ActivePatientsQuery,
): Promise<PatientsListResult<ActivePatient>> {
  return listActivePatients(options);
}

// get historical patients
export async function getHistoricalPatientsAction(
  options?: HistoricalPatientsQuery,
): Promise<PatientsListResult<HistoricalPatient>> {
  return listHistoricalPatients(options);
}

// get patient by study id
export async function getActivePatientByStudyIdAction(studyId: string) {
  return getActivePatientByStudyId(studyId);
}

// update patient
export async function updatePatientAction(
  national_id: string,
  payload: UpdatePatientPayload,
): Promise<MutationResponse> {
  return updateAssignedPatient(national_id, payload);
}

// get patient
export async function getPatientByNationalIdAction(nationalId: string) {
  const profile = await getPatientByNationalId(nationalId);
  if (!profile) return null;
  const visits = await getPatientVisitHistory(nationalId);
  return { ...profile, visits };
}

// get recent patients
export async function getRecentPatientsAction(params?: {
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  return listRecentPatients(params);
}
