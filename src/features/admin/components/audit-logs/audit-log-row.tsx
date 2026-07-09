"use client";
import { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import type { AuditLogRow } from "@/lib/types/audit-logs";
import { getAuditLogSeverity } from "../../constants/audit-logs.constants";
import { ActionBadge } from "./action-badge";
import { EntityBadge } from "./entity-badge";
import { AuditSeverityBadge } from "./audit-severity-badge";
import { formatFullTimestamp } from "@/lib/utils/date-format";

export const AuditLogRowComponent = memo(function AuditLogRowComponent({
  log,
  isSelected,
  onSelect,
}: {
  log: AuditLogRow;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const actorDisplay = log.actor_name?.trim() || "System";
  const severity = getAuditLogSeverity(log.action);

  return (
    <TableRow
      onClick={onSelect}
      aria-selected={isSelected}
      className={cn(
        "cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900/40",
        isSelected &&
          "bg-emerald-50/60 hover:bg-emerald-50/60 dark:bg-emerald-950/20",
      )}
    >
      {/* Timestamp */}
      <TableCell className="pl-4 text-sm text-gray-600 tabular-nums whitespace-nowrap">
        {formatFullTimestamp(log.created_at)}
      </TableCell>

      {/* Severity */}
      <TableCell>
        <AuditSeverityBadge severity={severity} />
      </TableCell>

      {/* Action */}
      <TableCell>
        <ActionBadge action={log.action} />
      </TableCell>

      {/* Actor */}
      <TableCell>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {actorDisplay}
          </p>
          {log.actor_role && (
            <p className="text-xs text-gray-400">{log.actor_role}</p>
          )}
        </div>
      </TableCell>

      {/* Entity */}
      <TableCell className="pr-4">
        <div className="flex flex-col gap-1">
          <EntityBadge entity={log.entity} />
          {log.entity_id != null && (
            <span className="text-xs text-gray-400 tabular-nums truncate max-w-32">
              {String(log.entity_id)}
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
