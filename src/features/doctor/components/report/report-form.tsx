"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  Clock,
  Stethoscope,
  Bold,
  Italic,
  List,
  Images,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import { ReportStatusBadge } from "../patients/status-badge";
import {
  useSaveReportDraft,
  useSignReport,
  useOpenReport,
  useExportReportPDF,
} from "../../hooks/use-report";
import { usePatientByStudyId } from "../../hooks/use-active-patients";
import { StudyImageViewer } from "../images/study-image-viewer";
import { reportSchema } from "../../validation/schemas";
import { resolvePatientReportStatus } from "../../utils/report-status";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { DoctorErrorState } from "../shared/ui";

// ---------------------------------------------------------------------------
// Report content is still saved through the exact same single-field API
// (`{ notes: string }` via useSaveReportDraft / useSignReport). The report
// body is just the Findings text now — Clinical Information, Impression,
// and Recommendations have been removed from this form.
// ---------------------------------------------------------------------------

const SECTION_DEFS = [
  {
    key: "findings" as const,
    header: "FINDINGS",
    label: "Findings",
    icon: Stethoscope,
    rows: 14,
    placeholder: "Describe the imaging findings in detail...",
    toolbar: true,
  },
];

type SectionKey = (typeof SECTION_DEFS)[number]["key"];
type Sections = Record<SectionKey, string>;

const EMPTY_SECTIONS: Sections = {
  findings: "",
};

function composeNotes(sections: Sections): string {
  return (sections.findings ?? "").trim();
}

function parseNotes(raw: string): Sections {
  const sections: Sections = { ...EMPTY_SECTIONS };
  if (!raw?.trim()) return sections;

  // Legacy reports may still contain the old
  // "CLINICAL INFORMATION: / FINDINGS: / IMPRESSION: / RECOMMENDATIONS:"
  // headers — strip them out and keep the rest as plain findings text so
  // older reports stay readable in this simplified form.
  const headerPattern =
    /^(CLINICAL INFORMATION|FINDINGS|IMPRESSION|RECOMMENDATIONS):[ \t]*$/gim;
  sections.findings = raw.replace(headerPattern, "").trim();

  return sections;
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="text-muted-foreground/70">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

function SaveIndicator({
  isSaving,
  isDirty,
  isError,
}: {
  isSaving: boolean;
  isDirty: boolean;
  isError: boolean;
}) {
  if (isSaving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (isError) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-red-500">
        Save failed
      </span>
    );
  }
  if (isDirty) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        Unsaved changes
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 className="w-3 h-3" />
      Draft saved
    </span>
  );
}

// Bold / italic / bullet-list helpers acting on the textarea's current
// selection — a light-touch toolbar, not a full rich-text editor.
function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string = before,
) {
  const { selectionStart, selectionEnd, value } = el;
  const selected = value.slice(selectionStart, selectionEnd) || "text";
  const next =
    value.slice(0, selectionStart) +
    before +
    selected +
    after +
    value.slice(selectionEnd);
  return {
    next,
    caret: selectionStart + before.length + selected.length + after.length,
  };
}

function prefixLines(el: HTMLTextAreaElement, prefix: string) {
  const { selectionStart, selectionEnd, value } = el;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const lineEnd = value.indexOf("\n", selectionEnd);
  const sliceEnd = lineEnd === -1 ? value.length : lineEnd;
  const block = value.slice(lineStart, sliceEnd);
  const updated = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
    .join("\n");
  const next = value.slice(0, lineStart) + updated + value.slice(sliceEnd);
  return { next, caret: lineStart + updated.length };
}

function SectionCard({
  def,
  value,
  onChange,
  disabled,
}: {
  def: (typeof SECTION_DEFS)[number];
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  const Icon = def.icon;
  const applyTransform = (
    e: React.MouseEvent<HTMLButtonElement>,
    fn: (el: HTMLTextAreaElement) => { next: string; caret: number },
  ) => {
    e.preventDefault();
    const container = e.currentTarget.closest("[data-section]");
    const el = container?.querySelector(
      "textarea",
    ) as HTMLTextAreaElement | null;
    if (!el) return;
    const { next, caret } = fn(el);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div
      data-section={def.key}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
            {def.label}
          </h3>
        </div>
        {def.toolbar && !disabled && (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Bold"
              onClick={(e) =>
                applyTransform(e, (el) => wrapSelection(el, "**"))
              }
              className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bold className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={(e) => applyTransform(e, (el) => wrapSelection(el, "_"))}
              className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Italic className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Bullet list"
              onClick={(e) => applyTransform(e, (el) => prefixLines(el, "• "))}
              className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      <div className="p-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={def.placeholder}
          rows={def.rows}
          disabled={disabled}
          className={cn(
            "w-full resize-none rounded-lg border border-transparent bg-transparent p-1 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-emerald-200/40 dark:focus:ring-emerald-800/30 focus:border-emerald-300 focus:bg-muted/20 transition-colors",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ReportForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const studyId = patientId;

  const {
    data: patient,
    isLoading: patientsLoading,
    refetch,
  } = usePatientByStudyId(studyId);
  const { data: openData, isLoading: reportLoading } = useOpenReport(studyId);

  const {
    mutate: saveDraft,
    isPending: isSaving,
    isError: isSaveError,
    isSuccess: justSaved,
    reset: resetSaveMutation,
  } = useSaveReportDraft(studyId);

  const { mutate: signReport, isPending: isSigning } = useSignReport(studyId);
  const { mutate: exportPdf, isPending: isExporting } =
    useExportReportPDF(studyId);

  const [sections, setSections] = useState<Sections>(EMPTY_SECTIONS);
  const [lastSavedNotes, setLastSavedNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!openData) return;
    const content =
      (openData as { report_content?: string }).report_content ?? "";
    const parsed = parseNotes(content);
    startTransition(() => {
      setSections(parsed);
      setLastSavedNotes(composeNotes(parsed));
    });
    resetSaveMutation();
  }, [openData, resetSaveMutation]);

  const composedNotes = useMemo(() => composeNotes(sections), [sections]);
  const isDirty = composedNotes !== lastSavedNotes;

  useEffect(() => {
    if (isDirty) resetSaveMutation();
  }, [isDirty, resetSaveMutation]);

  const reportStatus = resolvePatientReportStatus(
    (openData as { report_status?: string })?.report_status,
    patient ?? undefined,
  );
  const isSigned = reportStatus === "signed";


  const updateSection = (key: SectionKey, value: string) =>
    setSections((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const result = reportSchema.safeParse({ notes: composedNotes });
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Invalid report");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const onSaveDraft = () => {
    if (!validate()) return;
    saveDraft(
      { notes: composedNotes },
      { onSuccess: () => setLastSavedNotes(composedNotes) },
    );
  };

  const onSign = () => {
    if (!validate()) return;
    signReport(
      { notes: composedNotes },
      { onSuccess: () => setLastSavedNotes(composedNotes) },
    );
  };

  const images = patient?.studies?.images ?? [];

  if (patientsLoading || reportLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center gap-3 text-muted-foreground">
        <PulseLoader />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <DoctorErrorState
          message="Unable to load patient for this image."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-[#059669] hover:border-[#059669]/30 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground truncate">
                {patient.first_name} {patient.last_name}
              </h1>
              <ReportStatusBadge status={reportStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              <InfoPill label="Patient ID" value={patient.national_id} />
              <InfoPill label="Image" value={patient.study} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={() => exportPdf()}
            disabled={isExporting || !isSigned}
            className="gap-2 text-sm bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving || isSigned}
            className="gap-2 text-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            {isSaving ? "Saving…" : "Save Draft"}
          </Button>
          <Button
            onClick={onSign}
            disabled={isSigning || isSigned}
            className="gap-2 text-sm bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            {isSigning ? "Signing…" : isSigned ? "Signed" : "Sign & Finalize"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 items-start">
        {/* ── Left: imaging workspace ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-glow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-8 items-center justify-center rounded-full bg-[image:var(--brand-gradient-soft)]">
                  <Images className="size-4 text-emerald-700 dark:text-emerald-300" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-foreground">
                    Images
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {images.length > 0
                      ? `${patient.study} · ${images.length} image${images.length === 1 ? "" : "s"}`
                      : "Nothing uploaded"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[image:var(--brand-gradient-soft)] shadow-glow-sm">
                    <Archive className="size-6 text-emerald-700 dark:text-emerald-300" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      No images uploaded
                    </p>
                    <p className="max-w-[240px] text-xs text-muted-foreground">
                      No images have been uploaded for this image yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((img) => (
                    <StudyImageViewer
                      key={img.image_id}
                      studyId={String(patient.studies.study_id)}
                      imageId={img.image_id}
                      fileFormat={img.file_format}
                      viewType={img.view_type}
                      filePath={img.file_path}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </motion.div>

        {/* ── Right: Draft Report ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3"
        >
          {SECTION_DEFS.map((def) => (
            <SectionCard
              key={def.key}
              def={def}
              value={sections[def.key]}
              onChange={(val) => updateSection(def.key, val)}
              disabled={isSigned}
            />
          ))}

          <AnimatePresence>
            {validationError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 px-1"
              >
                {validationError}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex justify-end px-1">
            <SaveIndicator
              isSaving={isSaving}
              isDirty={isDirty}
              isError={isSaveError && !justSaved}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
