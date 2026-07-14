import { doctorFetch, doctorFetchBlob } from "./client";
import type { MutationResponse, SaveReportPayload } from "@/lib/types/doctor";

// types
export type OpenReportResponse = {
  report_id?: number;
  study_id: string;
  doctor_id: string;
  report_status: string;
  report_content: string;
  signed_at?: string;
};

export type ReportDetailResponse = {
  report_id?: number;
  report_content: string;
  report_status: string;
  patient_first_name: string;
  patient_last_name: string;
  study_type: string;
  study_date: string;
  assigned_doctor: string;
  signing_doctor: string | null;
  signed_at?: string;
  report_file_path?: string;
};

// open report
export async function openReport(studyId: string): Promise<OpenReportResponse> {
  return doctorFetch<OpenReportResponse>(`/reports/open/${studyId}`);
}

// fetch report
export async function fetchReport(studyId: string): Promise<ReportDetailResponse> {
  return doctorFetch<ReportDetailResponse>(`/reports/${studyId}`);
}

// save report
export async function saveReportDraft(
  studyId: string,
  payload: SaveReportPayload,
): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/reports/save/${studyId}`, {
    method: "PUT",
    body: JSON.stringify({ content: payload.notes }),
  });
}

// finalize report
export async function finalizeReport(studyId: string): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/reports/finalize/${studyId}`, {
    method: "POST",
  });
}

// export report
export async function exportReportPdf(studyId: string): Promise<Blob> {
  return doctorFetchBlob(`/reports/pdf/${studyId}`);
}
