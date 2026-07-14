import {
  fetchAssignedPatients,
  fetchHistoricalPatients,
  fetchPatientByStudyId,
  fetchRecentPatients,
  updatePatient,
} from "../api/patients.api";
import {
  normalizeActivePatientsQuery,
  normalizeHistoricalPatientsQuery,
  type ActivePatientsQuery,
  type HistoricalPatientsQuery,
} from "../utils/filters";
import {
  mapBackendHistoricalPatient,
  mapBackendPatientToActive,
} from "./patient.mapper";
import type {
  ActivePatient,
  BackendPatient,
  HistoricalPatient,
} from "@/lib/types/doctor";
import type { UpdatePatientPayload } from "@/lib/types/receptionist";

export type PatientsListResult<T extends ActivePatient | HistoricalPatient> = {
  patients: T[];
  total: number;
  pages: number;
  page: number;
};

export async function listActivePatients(
  filters: ActivePatientsQuery = {},
): Promise<PatientsListResult<ActivePatient>> {
  const query = normalizeActivePatientsQuery(filters);
  const response = await fetchAssignedPatients(query);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch patients");
  }

  const source = response.patients ?? response.data ?? [];

  return {
    patients: source.map((patient: BackendPatient) =>
      mapBackendPatientToActive(patient),
    ),
    total: response.total,
    pages: response.pages,
    page: response.page,
  };
}

export async function listHistoricalPatients(
  filters: HistoricalPatientsQuery = {},
): Promise<PatientsListResult<HistoricalPatient>> {
  const query = normalizeHistoricalPatientsQuery(filters);
  const response = await fetchHistoricalPatients(query);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch historical patients");
  }

  return {
    patients: (response.data ?? []).map(mapBackendHistoricalPatient),
    total: response.total,
    pages: response.pages,
    page: response.page,
  };
}

/** Resolves a single assigned patient by study id.
 *  Tries a direct filtered API call first; falls back to a broader search if needed. */
export async function getActivePatientByStudyId(
  studyId: string,
): Promise<ActivePatient | null> {
  try {
    const response = await fetchPatientByStudyId(studyId);
    if (response.success && response.patient) {
      return mapBackendPatientToActive(response.patient);
    }
  } catch {
    // fallback below
  }
  const { patients } = await listActivePatients({ limit: 50, page: 1 });
  return (
    patients.find((patient) => String(patient.studies.study_id) === studyId) ??
    null
  );
}

/** List recent patients from dedicated backend endpoint */
export async function listRecentPatients(params?: {
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<PatientsListResult<ActivePatient>> {
  const response = await fetchRecentPatients(params);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch recent patients");
  }
  const source = response.patients ?? response.data ?? [];
  return {
    patients: source.map((p: BackendPatient) => mapBackendPatientToActive(p)),
    total: response.total,
    pages: response.pages,
    page: response.page,
  };
}

export async function updateAssignedPatient(
  nationalId: string,
  payload: UpdatePatientPayload,
) {
  return updatePatient(nationalId, payload);
}

/** Resolves patient by national id from assigned or historical lists. */
export async function getPatientByNationalId(nationalId: string): Promise<{
  patient: ActivePatient | HistoricalPatient;
  source: "active" | "historical";
} | null> {
  const active = await listActivePatients({
    keyword: nationalId,
    limit: 50,
    page: 1,
  });
  const activeMatch = active.patients.find(
    (patient) => patient.national_id === nationalId,
  );
  if (activeMatch) {
    return { patient: activeMatch, source: "active" };
  }

  const history = await listHistoricalPatients({
    keyword: nationalId,
    limit: 50,
    page: 1,
  });
  const historyMatch = history.patients.find(
    (patient) => patient.national_id === nationalId,
  );
  if (historyMatch) {
    return { patient: historyMatch, source: "historical" };
  }

  return null;
}

/** All historical visits for a patient national id. */
export async function getPatientVisitHistory(nationalId: string) {
  const history = await listHistoricalPatients({
    keyword: nationalId,
    limit: 100,
    page: 1,
  });
  return history.patients.filter((p) => p.national_id === nationalId);
}
