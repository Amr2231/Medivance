"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, FileText, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tailwind-merge";
import { ReportStatusBadge, PatientStatusBadge } from "./status-badge";
import { PatientsFiltersModal } from "./patients-filters";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { useHistoricalPatients } from "../../hooks/use-historical-patients";
import { useExportReportPDF } from "../../hooks/use-report";
import { useDebounce } from "use-debounce";
const LIMIT = 10;
import { EmptyState } from "@/components/ui/empty-state";
import { PatientProfilePanel } from "./patient-profile-panel";
import { PulseLoader } from "@/components/ui/pulse-loader";
import type { ActivePatient, HistoricalPatient } from "@/lib/types/doctor";
import { PatientsSearchBar } from "../shared/patients-search-bar";
import { ViewReportModal } from "./historical/view-report-modal";
import { DownloadReportModal } from "./historical/download-report-modal";
import { DoctorTableCard, PatientAvatar } from "../shared/ui";

// TABLE HEADERS
const tableHeaders = [
  "Full Name",
  "Report Status",
  "Received",
  "Patient Status",
  "Actions",
];

export function HistoricalPatientsTable({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  // ===== FILTER STATE (local — زي ActivePatientsTable) =====
  const [search, setSearch] = useState("");
  const [filterStudy, setFilterStudy] = useState("all");
  // const [filterReportStatus, setFilterReportStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [viewPatient, setViewPatient] = useState<
    ActivePatient | HistoricalPatient | null
  >(null);
  const [viewReportStudyId, setViewReportStudyId] = useState<string | null>(
    null,
  );
  const [downloadPatient, setDownloadPatient] =
    useState<HistoricalPatient | null>(null);

  // ===== PAGINATION (client-side state — page lives in component, not URL,
  // so this table can be embedded as a tab without fighting the ?tab= param) =====
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, Number(searchParams?.page) || 1),
  );
  const [debouncedSearch] = useDebounce(search, 400);

  // ===== SERVER-SIDE FETCH =====
  const { data, isLoading } = useHistoricalPatients({
    keyword: debouncedSearch.trim() || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    // report_status:
    // filterReportStatus !== "all" ? filterReportStatus : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page: currentPage,
    limit: LIMIT,
  });

  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  const activeFilters = [
    filterStudy !== "all",
    // filterReportStatus !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  // ===== DOWNLOAD =====
  const exportPDF = useExportReportPDF(
    String(downloadPatient?.studies?.study_id ?? ""),
  );

  const handleConfirmDownload = () => {
    exportPDF.mutate(undefined, {
      onSuccess: () => setDownloadPatient(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <DoctorTableCard
          toolbar={
            <PatientsSearchBar
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              activeFilters={activeFilters}
              onOpenFilters={() => setFiltersOpen(true)}
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
                {tableHeaders.map((h) => (
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
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="text-center text-sm text-gray-400 py-10"
                  >
                    <EmptyState
                      title="No patients found"
                      icon={Trash}
                      description="We could not find any patients matching your search criteria."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient, i) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className={cn(
                      "border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900/40 group",
                    )}
                  >
                    {/* Full Name + NID */}
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <PatientAvatar
                          firstName={patient.first_name}
                          lastName={patient.last_name}
                          study={patient.study}
                        />
                        <div className="min-w-0 flex flex-col">
                          <span className="font-medium text-gray-800 truncate dark:text-gray-100">
                            {patient.first_name} {patient.last_name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {patient.national_id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Report Status */}
                    <TableCell>
                      <ReportStatusBadge status={patient.report_status} />
                    </TableCell>

                    {/* Received */}
                    <TableCell className="text-sm text-gray-500 tabular-nums">
                      {patient.received_date
                        ? new Date(patient.received_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </TableCell>

                    {/* Patient Status */}
                    <TableCell>
                      <PatientStatusBadge status={patient.patient_status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                              onClick={() => setViewPatient(patient)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Patient</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                              onClick={() =>
                                setViewReportStudyId(
                                  String(patient.studies.study_id),
                                )
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Report</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                              onClick={() => setDownloadPatient(patient)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download Report</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </DoctorTableCard>

        <PatientsFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filterStudy={filterStudy}
          setFilterStudy={(value) => {
            setFilterStudy(value);
            setCurrentPage(1);
          }}
          // filterReportStatus={filterReportStatus}
          // setFilterReportStatus={setFilterReportStatus}
          filterDate={filterDate}
          setFilterDate={(value) => {
            setFilterDate(value);
            setCurrentPage(1);
          }}
          sortDate={sortDate}
          setSortDate={(value) => {
            setSortDate(value);
            setCurrentPage(1);
          }}
        />

        <PatientProfilePanel
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
        />

        <ViewReportModal
          studyId={viewReportStudyId}
          onClose={() => setViewReportStudyId(null)}
        />

        <DownloadReportModal
          patient={downloadPatient}
          onClose={() => setDownloadPatient(null)}
          onConfirm={handleConfirmDownload}
          isLoading={exportPDF.isPending}
        />
      </>
    </TooltipProvider>
  );
}
