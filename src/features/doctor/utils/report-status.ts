import type { ReportStatus } from "@/lib/types/doctor";

// Mapping of normalized report statuses to their display labels
const REPORT_LABELS: Record<ReportStatus, string> = {
  "not written": "Not Written",
  written: "Written",
  signed: "Signed",
};

// Normalizes various raw input formats into a consistent ReportStatus type
export function normalizeReportStatus(raw?: string | null): ReportStatus {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase();

  // Check the normalized value against known report statuses and return the appropriate ReportStatus
  if (value === "signed") return "signed";
  if (value === "written") return "written";
  if (value === "not written" || value === "not_written") return "not written";
  return "not written";
}

// Formats a raw report status string into a user-friendly label for display in the UI
export function formatReportStatusLabel(raw?: string | null): string {
  const normalized = normalizeReportStatus(raw);
  return REPORT_LABELS[normalized];
}

// Resolves the patient's report status by checking the open report status first, then falling back to the patient's report status if the open report status is not provided
export function resolvePatientReportStatus(
  openReportStatus: string | undefined,
  patient?: { report_status?: string | null } | null,
): ReportStatus {
  return normalizeReportStatus(openReportStatus ?? patient?.report_status);
}
