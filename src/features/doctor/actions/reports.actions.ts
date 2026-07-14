"use server";

import {
  downloadReportPdf,
  getFullReport,
  getOpenReport,
  getReportDetail,
  saveDraft,
  signReport,
} from "../services/reports.service";
import type { MutationResponse, SaveReportPayload } from "@/lib/types/doctor";

// open report
export async function openReportAction(study_id: string) {
  return getOpenReport(study_id);
}

// get report
export async function getReportAction(study_id: string) {
  return getReportDetail(study_id);
}

// get full report
export async function getFullReportAction(study_id: string) {
  return getFullReport(study_id);
}

// save report
export async function saveReportDraftAction(
  study_id: string,
  payload: SaveReportPayload,
): Promise<MutationResponse> {
  return saveDraft(study_id, payload);
}

// sign report
export async function signReportAction(
  study_id: string,
  payload: SaveReportPayload,
): Promise<MutationResponse> {
  return signReport(study_id, payload);
}

// export report
export async function exportReportPDFAction(study_id: string): Promise<Blob> {
  return downloadReportPdf(study_id);
}
