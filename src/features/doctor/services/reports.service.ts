import {
  exportReportPdf,
  fetchReport,
  finalizeReport,
  openReport,
  saveReportDraft,
} from "../api/reports.api";
import type { SaveReportPayload } from "@/lib/types/doctor";

export async function getOpenReport(studyId: string) {
  return openReport(studyId);
}

export async function getReportDetail(studyId: string) {
  return fetchReport(studyId);
}

export async function getFullReport(studyId: string) {
  const report = await fetchReport(studyId);
  return {
    success: Boolean(report.report_id),
    data: report.report_id ? report : null,
  };
}

export async function saveDraft(studyId: string, payload: SaveReportPayload) {
  return saveReportDraft(studyId, payload);
}

export async function signReport(studyId: string, payload: SaveReportPayload) {
  await saveReportDraft(studyId, payload);
  return finalizeReport(studyId);
}

export async function downloadReportPdf(studyId: string) {
  return exportReportPdf(studyId);
}
