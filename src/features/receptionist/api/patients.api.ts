import { serverFetch, serverFetchBlob } from "@/lib/shared/api/server-client";
import type {
  AddPatientPayload,
  HistoryListResponse,
  MutationResponse,
  PatientsListResponse,
  UpdatePatientPayload,
} from "@/lib/types/receptionist";

export type DoctorListItem = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
};

function buildPatientQuery(params?: {
  keyword?: string;
  study_type?: string;
  doctor_id?: string;
  date?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.keyword) search.set("keyword", params.keyword);
  if (params?.study_type) search.set("study_type", params.study_type);
  if (params?.doctor_id) search.set("doctor_id", params.doctor_id);
  if (params?.date) search.set("date", params.date);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  return search.toString();
}

export async function fetchActivePatients(params?: Parameters<
  typeof buildPatientQuery
>[0]): Promise<PatientsListResponse> {
  const query = buildPatientQuery(params);
  return serverFetch<PatientsListResponse>(
    `/patients/active${query ? `?${query}` : ""}`,
  );
}

export async function fetchHistoricalPatients(params?: Parameters<
  typeof buildPatientQuery
>[0]): Promise<HistoryListResponse> {
  const query = buildPatientQuery(params);
  return serverFetch<HistoryListResponse>(
    `/patients/history${query ? `?${query}` : ""}`,
  );
}

export async function createPatient(payload: AddPatientPayload) {
  return serverFetch<MutationResponse>("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePatient(
  nationalId: string,
  payload: UpdatePatientPayload,
) {
  return serverFetch<MutationResponse>(`/patients/${nationalId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePatient(nationalId: string) {
  return serverFetch<MutationResponse>(`/patients/${nationalId}`, {
    method: "DELETE",
  });
}

export async function fetchDoctors() {
  return serverFetch<{
    success: boolean;
    data: DoctorListItem[];
  }>("/users?status=active&role=Doctor");
}

export async function reassignPatient(
  nationalId: string,
  payload: { doctor_id: number; study_type: string; study_date: string },
) {
  return serverFetch<MutationResponse>(
    `/patients/${nationalId}/reassign-doctor`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function downloadReportPdf(studyId: string) {
  try {
    const blob = await serverFetchBlob(`/reports/pdf/${studyId}`);
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return { success: true, base64 };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate report",
    };
  }
}
