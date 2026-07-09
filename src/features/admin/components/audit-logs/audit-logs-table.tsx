"use client";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
import { Download, ScrollText, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  TableToolbar,
} from "../shared";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import {
  AUDIT_TABLE_HEADERS,
  getAuditLogRowKey,
  getAuditLogSeverity,
} from "../../constants/audit-logs.constants";
import { exportRowsToCsv } from "../../utils/export-csv";
import type { AuditLogRow } from "@/lib/types/audit-logs";
import type { AuditLogFiltersState } from "./audit-log-filters-modal";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { AuditLogRowComponent } from "./audit-log-row";
import { AuditLogDetailsPanel } from "./audit-log-details-panel";

// dynamic imports
const AuditLogFiltersModal = dynamic(() =>
  import("./audit-log-filters-modal").then((m) => ({
    default: m.AuditLogFiltersModal,
  })),
);

// constants
const DEFAULT_FILTERS: AuditLogFiltersState = {
  action: "",
  entity: "",
  actorId: "",
  entityId: "",
  fromDate: "",
  toDate: "",
  sort: "created_at",
  order: "DESC",
};

// Audit logs table
export function AuditLogsTable() {
  // state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFiltersState>(DEFAULT_FILTERS);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // queries
  const activeFilterCount = [
    filters.action,
    filters.entity,
    filters.actorId,
    filters.entityId,
    filters.fromDate,
    filters.toDate,
    filters.sort !== "created_at",
    filters.order !== "DESC",
  ].filter(Boolean).length;

  const { data, isLoading, isError, isFetching } = useAuditLogs({
    page,
    limit: 20,
    keyword: debouncedSearch || undefined,
    action: filters.action || undefined,
    entity: filters.entity || undefined,
    actor_id: filters.actorId ? Number(filters.actorId) : undefined,
    entity_id: filters.entityId || undefined,
    from_date: filters.fromDate || undefined,
    to_date: filters.toDate || undefined,
    sort: filters.sort as "created_at" | "action" | "entity" | "actor_name",
    order: filters.order,
  });

  // computed values
  const logs = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  // Keep the details panel populated directly — default to the first row
  // whenever the visible page of logs changes (new page, new filters, first
  // load) instead of requiring a click to "open" anything.
  const selectedLog: AuditLogRow | null =
    logs.find((log, index) => getAuditLogRowKey(log, index) === selectedKey) ??
    logs[0] ??
    null;

  // handlers
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleApplyFilters = useCallback((next: AuditLogFiltersState) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setFiltersOpen(false);
  }, []);

  const handleViewActorTimeline = useCallback((actorId: number) => {
    setFilters((prev) => ({ ...prev, actorId: String(actorId) }));
    setPage(1);
  }, []);

  const handleExport = useCallback(() => {
    exportRowsToCsv(
      `audit-logs-${new Date().toISOString().slice(0, 10)}`,
      logs.map((log) => ({
        id: log.audit_log_id ?? log.id ?? "",
        timestamp: log.created_at,
        severity: getAuditLogSeverity(log.action),
        action: log.action,
        actor: log.actor_name || "System",
        actor_role: log.actor_role || "",
        entity: log.entity,
        entity_id: log.entity_id,
        description: log.description,
        ip_address: log.ip_address,
      })),
    );
  }, [logs]);

  // loading state
  if (isLoading) return <AdminLoadingState />;

  // error state
  if (isError) {
    return (
      <AdminErrorState
        title="Failed to load audit logs"
        message="Ensure you have admin access and the backend is running."
      />
    );
  }

  return (
    <AdminPageShell
      title="Audit Logs"
      description={`Complete activity trail across the system${
        total > 0 ? ` · ${total} entries` : ""
      }`}
      actions={
        <Button
          variant="outline"
          className="gap-2"
          disabled={logs.length === 0}
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      }
    >
      {/* table toolbar */}
      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search actor, description, or entity ID..."
        actions={
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
              activeFilterCount > 0 &&
                "bg-emerald-600 text-white border-emerald-600",
            )}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-[#059669] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        }
      />

      {/* table + persistent details panel (docked, not a popup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          <AdminTableShell isFetching={isFetching}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
                  {AUDIT_TABLE_HEADERS.map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold text-gray-500 first:pl-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={AUDIT_TABLE_HEADERS.length}
                      className="py-10"
                    >
                      <EmptyState
                        icon={ScrollText}
                        title="No audit logs found"
                        description="Try adjusting your search or filters."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => {
                    const key = getAuditLogRowKey(log, index);
                    return (
                      <AuditLogRowComponent
                        key={key}
                        log={log}
                        isSelected={key === selectedKey}
                        onSelect={() => setSelectedKey(key)}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
          </AdminTableShell>

          {/* pagination */}
          {totalPages > 1 && (
            <PaginationWrapper
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* details panel — persistent, docked in the layout, not a popup */}
        <AuditLogDetailsPanel
          log={selectedLog}
          onViewActorTimeline={handleViewActorTimeline}
        />
      </div>

      {/* filters */}
      {filtersOpen && (
        <AuditLogFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}
    </AdminPageShell>
  );
}
