"use server";

import * as patientsApi from "../api/patients.api";
import { suggestSlots } from "@/features/receptionist/operations/actions/scheduling.actions";
import type {
  AddPatientPayload,
  HistoryListResponse,
  MutationResponse,
  PatientsListResponse,
  UpdatePatientPayload,
} from "@/lib/types/receptionist";

export async function getActivePatientsAction(
  params?: Parameters<typeof patientsApi.fetchActivePatients>[0],
): Promise<PatientsListResponse> {
  return patientsApi.fetchActivePatients(params);
}

export async function getHistoricalPatientsAction(
  params?: Parameters<typeof patientsApi.fetchHistoricalPatients>[0],
): Promise<HistoryListResponse> {
  return patientsApi.fetchHistoricalPatients(params);
}

export async function addPatientAction(payload: AddPatientPayload) {
  return patientsApi.createPatient(payload);
}

export async function updatePatientAction(
  national_id: string,
  payload: UpdatePatientPayload,
) {
  return patientsApi.updatePatient(national_id, payload);
}

export async function deletePatientAction(national_id: string) {
  return patientsApi.deletePatient(national_id);
}

export async function getDoctorsAction() {
  return patientsApi.fetchDoctors();
}

export async function reassignPatientAction(
  national_id: string,
  payload: { doctor_id: number; study_type: string; study_date: string },
): Promise<MutationResponse> {
  try {
    const result = await patientsApi.reassignPatient(national_id, payload);
    return {
      success: true,
      message: result.message ?? "Reassigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reassign",
    };
  }
}

export async function downloadReportAction(study_id: string) {
  return patientsApi.downloadReportPdf(study_id);
}

export async function getSuggestedSlotsAction(payload: {
  doctor_id: number;
  date: string;
  national_id?: string;
  duration_minutes?: number;
}) {
  return suggestSlots(payload);
}
