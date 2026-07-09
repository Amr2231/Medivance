"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Search, RotateCcw, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { useDeactivatedPatients } from "../../hooks/use-deactivated-patients";
import { useReactivatePatient } from "../../hooks/use-reactivate-patient";
import type { DeactivatedPatient } from "../../actions/users.actions";
import PaginationWrapper from "@/components/ui/paginationWrapper";

// Table headers — kept visually aligned with the active users table
export const TABLE_HEADERS = [
  "Patient",
  "Doctor",
  "Image Date",
  "Contact",
  "Actions",
] as const;

const PATIENT_AVATAR_STYLE =
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";

// Reactivate patient modal
function ReactivatePatientModal({
  patient,
  onClose,
  onConfirm,
  isPending,
}: {
  patient: DeactivatedPatient | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        {/* header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Reactivate Patient
          </DialogTitle>

          {/* description */}
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to reactivate{" "}
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {patient?.first_name} {patient?.last_name} ?
            </span>
            They will appear in the active patients list again.
          </DialogDescription>
        </DialogHeader>

        {/* footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? "Reactivating..." : "Yes, Reactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Deactivated patients table
export function DeactivatedPatientsTable() {
  // states
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const sortDate = "newest" as const;
  const filterDate = undefined;
  const [reactivateTarget, setReactivateTarget] =
    useState<DeactivatedPatient | null>(null);

  // hooks
  const { data, isLoading } = useDeactivatedPatients({
    keyword: debouncedSearch || undefined,
    page,
    sort: sortDate,
    created_date: filterDate,
  });

  // computed values
  const patients = data?.data ?? [];
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  // mutations
  const { mutate: reactivatePatient, isPending: isReactivating } =
    useReactivatePatient();

  // handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* ── Unified card: filter bar + table + pagination footer ── */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in duration-300">
          {/* ── Filter bar ── */}
          <div className="flex flex-wrap items-center gap-2.5 p-4 border-b border-gray-100 dark:border-gray-800">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                placeholder="Search by name or National ID..."
                className="pl-9 h-10 text-sm"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Total */}
            {total > 0 && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {total} deactivated
              </span>
            )}
          </div>

          {/* ── Table ── */}
          <Table>
            <TableHeader>
              {/* Table headers */}
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-800">
                {TABLE_HEADERS.map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 first-of-type:pl-4"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Table rows */}
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center text-sm py-10"
                  >
                    {/* empty state */}
                    <EmptyState
                      icon={UserX}
                      title="No deactivated patients"
                      description="All patients are currently active"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => {
                  const initials =
                    `${patient.first_name?.charAt(0) ?? ""}${patient.last_name?.charAt(0) ?? ""}`.toUpperCase();

                  return (
                    <TableRow
                      key={patient.national_id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900 group"
                    >
                      {/* Patient — avatar + name + national id */}
                      <TableCell className="pl-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                              PATIENT_AVATAR_STYLE,
                            )}
                          >
                            {initials || "—"}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              {patient.national_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* doctor */}
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {patient.doctor_name}
                      </TableCell>

                      {/* study date */}
                      <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
                        {new Date(patient.study_date).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>

                      {/* phone */}
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {patient.phone_number}
                      </TableCell>

                      {/* reactivate */}
                      <TableCell className="pr-4">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                            onClick={() => setReactivateTarget(patient)}
                            disabled={isReactivating}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ── Footer: count + pagination, inside the same card ── */}
          {patients.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {patients.length} of {total || patients.length}{" "}
                deactivated patients
              </p>
              {totalPages > 1 && (
                <PaginationWrapper
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <ReactivatePatientModal
        patient={reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={() => {
          if (!reactivateTarget) return;
          reactivatePatient(reactivateTarget.national_id);
          setReactivateTarget(null);
        }}
        isPending={isReactivating}
      />
    </>
  );
}
