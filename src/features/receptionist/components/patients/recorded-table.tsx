"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Eye,
  FileDown,
  History,
  Search,
  SlidersHorizontal,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReassignModal, DownloadReportModal, ViewPatientModal } from "./modals";
import { HistoricalFiltersModal } from "./patients-filters";
import { useHistoricalPatients } from "../../hooks/use-historical";
import { useReassignPatient } from "../../hooks/use-reassign-patient";
import { useDownloadReport } from "../../hooks/use-download-report";
import type { HistoricalPatient } from "@/lib/types/receptionist";
import { StatusBadge } from "./status-badge";
import { useDebounce } from "use-debounce";
import { TABLE_HEADERS } from "@/lib/constants/patient-table.constants";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { OperationalPageShell as ReceptionPageShell } from "@/components/shared/operational-page-shell";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { TableCard } from "@/components/shared/table-card";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { NavigationTabs, type NavigationTab } from "@/components/shared/tabs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";

type PatientTab = "active" | "historical";
const PATIENT_TABS: NavigationTab<PatientTab>[] = [
  { id: "active", label: "Active patients" },
  { id: "historical", label: "Historical records" },
];

export function RecordedTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterStudy, setFilterStudy] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");

  const [viewPatient, setViewPatient] = useState<HistoricalPatient | null>(
    null,
  );
  const [reassignPatient, setReassignPatient] =
    useState<HistoricalPatient | null>(null);
  const [downloadPatient, setDownloadPatient] =
    useState<HistoricalPatient | null>(null);

  const [debouncedSearch] = useDebounce(search, 150);
  const { data: response, isLoading } = useHistoricalPatients({
    keyword: debouncedSearch || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page,
  });

  const totalPages = Math.ceil((response?.total ?? 0) / 10);

  const patients = useMemo(() => response?.data ?? [], [response?.data]);

  const { mutate: reassign } = useReassignPatient();
  const { download } = useDownloadReport();

  const activeFilters = [
    filterStudy !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <ReceptionPageShell
        title="Historical Patients"
        description="View and manage your historical patients"
      >
        <NavigationTabs
          tabs={PATIENT_TABS}
          active="historical"
          onChange={(tab: PatientTab) => {
            if (tab === "active") router.push("/receptionist/patients");
          }}
        />
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              placeholder="Search by patient name or National ID..."
              className="pl-9 h-10 text-sm "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
              activeFilters > 0 && "border-[#059669] text-[#059669]",
            )}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[10px] text-white font-medium">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50 dark:border-gray-800">
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
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length + 1}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No historical records found"
                      description="Try adjusting your search or filters"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient, i) => (
                  <motion.tr
                    key={patient.study_id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className="border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900/40 group"
                  >
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <PatientAvatar
                          firstName={patient.first_name}
                          lastName={patient.last_name}
                          study={patient.study_type}
                        />
                        <div className="min-w-0 flex flex-col">
                        <span className="font-medium text-gray-800 truncate dark:text-gray-200 ">
                          {patient.first_name} {patient.last_name}
                        </span>

                        <span className="text-xs text-gray-400 font-mono">
                          {patient.national_id}
                        </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.doctor_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(patient.study_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={patient.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.phone_number}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300"
                          onClick={() => setViewPatient(patient)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300"
                          onClick={() => setDownloadPatient(patient)}
                        >
                          <FileDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300"
                          onClick={() => setReassignPatient(patient)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableCard>
        <HistoricalFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filterStudy={filterStudy}
          setFilterStudy={(value) => {
            setFilterStudy(value);
            setPage(1);
          }}
          filterDate={filterDate}
          setFilterDate={(value) => {
            setFilterDate(value);
            setPage(1);
          }}
          sortDate={sortDate}
          setSortDate={(value) => {
            setSortDate(value);
            setPage(1);
          }}
        />
        <PaginationWrapper
          currentPage={page}
          totalPages={totalPages}
          searchParams={{ page: String(page) }}
          onPageChange={setPage}
        />
      </ReceptionPageShell>

      <ViewPatientModal
        patient={viewPatient}
        onClose={() => setViewPatient(null)}
      />

      <ReassignModal
        patient={reassignPatient}
        onClose={() => setReassignPatient(null)}
        onSave={(form) => {
          if (!reassignPatient) return;
          reassign({ national_id: reassignPatient.national_id, ...form });
          setReassignPatient(null);
        }}
      />

      <DownloadReportModal
        patient={downloadPatient}
        onClose={() => setDownloadPatient(null)}
        onConfirm={() => {
          if (!downloadPatient) return;
          download(String(downloadPatient.study_id));
          setDownloadPatient(null);
        }}
      />
    </>
  );
}
