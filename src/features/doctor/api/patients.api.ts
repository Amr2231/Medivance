import { doctorFetch } from "./client";
import type {
  ActivePatientsListResponse,
  HistoricalPatientsListResponse,
  MutationResponse,
} from "@/lib/types/doctor";
import type { UpdatePatientPayload } from "@/lib/types/receptionist";
import {
  buildSearchParams,
  type ActivePatientsQuery,
  type HistoricalPatientsQuery,
} from "../utils/filters";

// fetch assigned patients of doctor
export async function fetchAssignedPatients(
  query: ActivePatientsQuery,
): Promise<ActivePatientsListResponse> {
  const params = buildSearchParams({
    keyword: query.keyword,
    study_type: query.study_type,
    report_status: query.report_status,
    date: query.date,
    sort: query.sort,
    page: query.page,
    limit: query.limit,
  });

  return doctorFetch<ActivePatientsListResponse>(
    `/patients/assigned?${params.toString()}`,
  );
}

// fetch historical patients
export async function fetchHistoricalPatients(
  query: HistoricalPatientsQuery,
): Promise<HistoricalPatientsListResponse> {
  const params = buildSearchParams({
    keyword: query.keyword,
    study_type: query.study_type,
    date: query.date,
    sort: query.sort,
    page: query.page,
    limit: query.limit,
  });

  return doctorFetch<HistoricalPatientsListResponse>(
    `/patients/my-history?${params.toString()}`,
  );
}

// update patient
export async function updatePatient(
  nationalId: string,
  payload: UpdatePatientPayload,
): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/patients/${nationalId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Fetch a single patient by study id (includes completed studies). */
export async function fetchPatientByStudyId(
  studyId: string,
): Promise<{
  success: boolean;
  patient: import("@/lib/types/doctor").BackendPatient;
}> {
  return doctorFetch(`/patients/study/${studyId}`);
}

/** Fetch recent patients from dedicated backend endpoint */
export async function fetchRecentPatients(params?: {
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<ActivePatientsListResponse> {
  const searchParams = buildSearchParams({
    keyword: params?.keyword,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
  });
  return doctorFetch<ActivePatientsListResponse>(
    `/patients/recent?${searchParams.toString()}`,
  );
}
