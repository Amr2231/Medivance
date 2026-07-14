"use client";

import { useState } from "react";
import Link from "next/link";
import { History, User } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorTableCard,
  PatientAvatar,
  TableToolbar,
} from "../shared/ui";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { useRecentPatients } from "../../hooks/use-active-patients";
import { DEFAULT_PAGE_SIZE } from "@/lib/shared/constants/api";

// Component — content only (no page shell), meant to be embedded as a tab
// inside the unified Patients page (see patients-hub-page.tsx).
export function RecentPatientsTable() {
  // hooks
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 400);
  const [currentPage, setCurrentPage] = useState(1);

  // useQuery
  const { data, isLoading, isError, refetch } = useRecentPatients({
    keyword: debounced.trim() || undefined,
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
  });

  // render
  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  // Loading state
  if (isLoading) return <DoctorLoadingState />;
  // Error state
  if (isError) {
    return <DoctorErrorState onRetry={() => refetch()} />;
  }

  // Render
  return (
    <DoctorTableCard
      toolbar={
        <TableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search patients..."
          className="flex-1"
        />
      }
      footer={
        patients.length > 0 ? (
          <>
            <p className="text-sm text-gray-500">
              Showing {patients.length} of {data?.total ?? patients.length}{" "}
              patients
            </p>
            {totalPages > 1 && (
              <PaginationWrapper
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : undefined
      }
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
            {["Patient", "Date", "Report", "Actions"].map((h) => (
              <TableHead
                key={h}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 first:pl-4"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10">
                <EmptyState
                  icon={History}
                  title="No recent patients"
                  description="Patients appear here after you work on images."
                />
              </TableCell>
            </TableRow>
          ) : (
            patients.map((p) => (
              <TableRow
                key={`${p.national_id}-${p.studies.study_id}`}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-900/40"
              >
                <TableCell className="pl-4 py-3">
                  <div className="flex items-center gap-3">
                    <PatientAvatar
                      firstName={p.first_name}
                      lastName={p.last_name}
                      study={p.study}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {p.national_id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 tabular-nums">
                  {formatFullTimestamp(p.received_date)}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {p.report_status ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Link href={`/doctor/patients/profile/${p.national_id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DoctorTableCard>
  );
}
