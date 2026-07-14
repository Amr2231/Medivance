"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ReportStatusBadge } from "@/features/doctor/components/patients/status-badge";
import { useGetReport } from "@/features/doctor/hooks/use-report";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  Activity,
  Calendar,
  ClipboardMinus,
  FileText,
  Loader2,
  Stethoscope,
  User,
  UserCheck,
} from "lucide-react";
import type { ReactNode } from "react";

type ViewReportModalProps = {
  studyId: string | null;
  onClose: () => void;
};

// Small metadata tile used in the summary grid at the top of the report
function InfoTile({
  icon: Icon,
  label,
  children,
  span,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  span?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3",
        span && "col-span-2",
      )}
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="truncate text-sm font-semibold text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

// Lightweight renderer for report findings: turns **bold** spans, bullet
// lines, and ALL-CAPS section headers into readable, structured markup
// without pulling in a full markdown parser.
function renderInlineBold(text: string, keyPrefix: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong
        key={`${keyPrefix}-${i}`}
        className="font-semibold text-foreground"
      >
        {part}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
}

function FindingsContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return null;

        const isHeader = /^[A-Z][A-Z\s/()-]{2,}:?$/.test(
          line.replace(/\*\*/g, ""),
        );
        const isBullet = /^[•\-]\s?/.test(line);

        if (isHeader) {
          return (
            <p
              key={idx}
              className="pt-3 text-xs font-bold uppercase tracking-wide text-primary first:pt-0"
            >
              {renderInlineBold(line.replace(/:$/, ""), `h-${idx}`)}
            </p>
          );
        }

        if (isBullet) {
          return (
            <div
              key={idx}
              className="flex gap-2 pl-1 text-sm leading-relaxed text-foreground/90"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              <span>
                {renderInlineBold(line.replace(/^[•\-]\s?/, ""), `b-${idx}`)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm leading-relaxed text-foreground/90">
            {renderInlineBold(line, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}

export function ViewReportModal({ studyId, onClose }: ViewReportModalProps) {
  const { data: report, isLoading } = useGetReport(studyId ?? "");

  return (
    <Dialog open={Boolean(studyId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-background/95 py-4 pl-6 pr-14 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {report
                    ? `${report.patient_first_name} ${report.patient_last_name}`
                    : "Report"}
                </DialogTitle>
                {report && (
                  <p className="text-xs text-muted-foreground">
                    {report.study_type} Image
                  </p>
                )}
              </div>
            </div>
            {report && <ReportStatusBadge status={report.report_status} />}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading report...
          </div>
        ) : !report ? (
          <div className="py-10">
            <EmptyState
              icon={ClipboardMinus}
              title="No report found"
              description="This report does not exist or has been deleted."
            />
          </div>
        ) : (
          <div className="space-y-5 px-6 py-5">
            <div className="grid grid-cols-2 gap-2.5">
              <InfoTile icon={Stethoscope} label="Image Type">
                {report.study_type}
              </InfoTile>
              <InfoTile icon={Calendar} label="Image Date">
                {report.study_date
                  ? new Date(report.study_date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </InfoTile>
              <InfoTile icon={User} label="Assigned Doctor">
                {report.assigned_doctor ?? "—"}
              </InfoTile>
              {report.signing_doctor && (
                <InfoTile icon={UserCheck} label="Signed By">
                  {report.signing_doctor}
                </InfoTile>
              )}
              {report.signed_at && (
                <InfoTile
                  icon={Activity}
                  label="Signed At"
                  span={!report.signing_doctor}
                >
                  {
                    new Date(report.signed_at)
                      .toISOString()
                      .replace("T", " ")
                      .split(".")[0]
                  }
                </InfoTile>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Findings
              </p>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                {report.report_content ? (
                  <FindingsContent content={report.report_content} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No findings recorded.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-6 py-3.5 backdrop-blur">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
