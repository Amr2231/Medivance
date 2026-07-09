"use client";
import { useState } from "react";
import { Check, Copy, FileClock, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import type { AuditLogRow } from "@/lib/types/audit-logs";
import { getAuditLogSeverity } from "../../constants/audit-logs.constants";
import { AuditSeverityBadge } from "./audit-severity-badge";
import { ActionBadge } from "./action-badge";
import { EntityBadge } from "./entity-badge";
import { formatFullTimestamp } from "@/lib/utils/date-format";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </dt>
      <dd className="text-sm text-gray-800 dark:text-gray-200">{children}</dd>
    </div>
  );
}

export function AuditLogDetailsPanel({
  log,
  onViewActorTimeline,
}: {
  log: AuditLogRow | null;
  onViewActorTimeline: (actorId: number) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!log) {
    return (
      <div className="hidden lg:block rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-8 h-fit sticky top-6">
        <div className="flex flex-col items-center text-center py-10 text-gray-400">
          <ScrollText className="w-8 h-8 mb-2" />
          <p className="text-sm">Select a log to view its details</p>
        </div>
      </div>
    );
  }

  const id = log.audit_log_id ?? log.id;
  const severity = getAuditLogSeverity(log.action);
  const rawPayload = JSON.stringify(log, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawPayload);
      setCopied(true);
      toast.success("Log payload copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — clipboard unavailable");
    }
  };

  return (
    <div className="hidden lg:block rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 h-fit sticky top-6 overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Log Details
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400"
          onClick={handleCopy}
          aria-label="Copy raw payload"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-11rem)] overflow-y-auto">
        {id != null && (
          <Field label="Event ID">
            <span className="font-mono text-xs">{String(id)}</span>
          </Field>
        )}

        <div className="flex items-center gap-2">
          <AuditSeverityBadge severity={severity} />
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <Field label="Timestamp">
            <span className="tabular-nums text-xs">
              {formatFullTimestamp(log.created_at)}
            </span>
          </Field>

          <Field label="Action">
            <ActionBadge action={log.action} />
          </Field>

          <Field label="Actor">
            <div>
              <p className="truncate">{log.actor_name?.trim() || "System"}</p>
              {log.actor_role && (
                <p className="text-xs text-gray-400">{log.actor_role}</p>
              )}
            </div>
          </Field>

          <Field label="Entity">
            <div className="flex flex-col gap-1 items-start">
              <EntityBadge entity={log.entity} />
              {log.entity_id != null && (
                <span className="text-xs text-gray-400 font-mono">
                  {String(log.entity_id)}
                </span>
              )}
            </div>
          </Field>

          {log.ip_address && (
            <Field label="Source IP">
              <span className="font-mono text-xs">{log.ip_address}</span>
            </Field>
          )}
        </dl>

        {log.description && (
          <Field label="Description">
            <p className="text-gray-700 dark:text-gray-300">
              {log.description}
            </p>
          </Field>
        )}

        {/* raw payload */}
        <div>
          <dt className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Raw Payload (JSON)
          </dt>
          <pre
            className={cn(
              "rounded-lg bg-gray-950 text-emerald-300 text-[11px] leading-relaxed p-3 overflow-x-auto font-mono",
              "border border-gray-800",
            )}
          >
            {rawPayload}
          </pre>
        </div>
      </div>

      {/* footer actions */}
      {log.actor_id != null && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={() => onViewActorTimeline(log.actor_id as number)}
          >
            <FileClock className="w-3.5 h-3.5" />
            View {log.actor_name?.trim() || "actor"}&apos;s timeline
          </Button>
        </div>
      )}
    </div>
  );
}
