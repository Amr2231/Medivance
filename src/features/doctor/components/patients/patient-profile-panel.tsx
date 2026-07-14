"use client";

// Patient "profile" panel — opened from the Eye icon on the patients
// tables. Same slide-over shell/visual language as the admin Users table's
// UserProfilePanel, but the content underneath is patient/study data
// instead of account activity + sessions: study notes and report history.

import { useState } from "react";
import { FileText, NotebookPen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import type { ActivePatient, HistoricalPatient } from "@/lib/types/doctor";
import { ReportStatusBadge, PatientStatusBadge } from "./status-badge";

const TABS = [
  { id: "notes", label: "Image Notes" },
  { id: "reports", label: "Reports" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function PatientProfilePanel({
  patient,
  onClose,
}: {
  patient: ActivePatient | HistoricalPatient | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("notes");

  if (!patient) return null;

  const initials =
    `${patient.first_name?.charAt(0) ?? ""}${patient.last_name?.charAt(0) ?? ""}`.toUpperCase();

  const notes = patient.studies?.notes ?? [];
  const reports = patient.studies?.reports ?? [];

  return (
    <Sheet open={!!patient} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="sr-only">Patient Profile</SheetTitle>
          <SheetDescription className="sr-only">
            Details, image notes, and reports for {patient.first_name}{" "}
            {patient.last_name}
          </SheetDescription>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              {initials || "—"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-xs text-gray-500 font-mono truncate">
                {patient.national_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <ReportStatusBadge status={patient.report_status} />
            <PatientStatusBadge status={patient.patient_status} />
          </div>
        </SheetHeader>

        {/* basic info */}
        <div className="px-5 py-4 border-b grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Image
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {patient.study || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Gender
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {patient.gender || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Received
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {patient.received_date
                ? new Date(patient.received_date).toLocaleDateString(
                    "en-GB",
                    { year: "numeric", month: "short", day: "numeric" },
                  )
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Images
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {patient.image_numbers ?? "—"}
            </p>
          </div>
          {patient.description && (
            <div className="col-span-2">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
                Description
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {patient.description}
              </p>
            </div>
          )}
        </div>

        {/* tabs */}
        <div className="flex border-b px-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "notes" &&
            (notes.length === 0 ? (
              <EmptyState
                icon={NotebookPen}
                title="No image notes"
                description="Notes added to this image will appear here."
              />
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {note.doctor}
                      </p>
                      <p className="text-[11px] text-gray-400 tabular-nums">
                        {formatFullTimestamp(note.created_at)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "reports" &&
            (reports.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No reports yet"
                description="Reports created for this image will appear here."
              />
            ) : (
              <ul className="space-y-3">
                {reports.map((report) => (
                  <li
                    key={report.report_id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <ReportStatusBadge status={report.report_status} />
                      <p className="text-[11px] text-gray-400 tabular-nums">
                        {formatFullTimestamp(report.created_at)}
                      </p>
                    </div>
                    {report.report_url && (
                      <a
                        href={report.report_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        View report file
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
