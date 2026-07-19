"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import { ActiveFiltersModal } from "./patients-filters";
import {
  ViewPatientModal,
  EditPatientModal,
  DeletePatientModal,
} from "./modals";
import { usePatients } from "../../hooks/use-patients";
import { useDeletePatient } from "../../hooks/use-delete-patient";
import { useUpdatePatient } from "../../hooks/use-update-patient";
import { PatientsDataTable } from "./patients-data-table";
import { AddPatientModal } from "./add-patient-modal";
import type { ActivePatient } from "@/lib/types/receptionist";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { OperationalPageShell as ReceptionPageShell } from "@/components/shared/operational-page-shell";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { NavigationTabs, type NavigationTab } from "@/components/shared/tabs";
import { OPEN_ADD_PATIENT_SIGNAL } from "@/lib/constants/ui-signals.constants";

type PatientTab = "active" | "historical";
const PATIENT_TABS: NavigationTab<PatientTab>[] = [
  { id: "active", label: "Active patients" },
  { id: "historical", label: "Historical records" },
];

export function PatientsTable() {
  // hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // pagination state
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));

  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [filterStudy, setFilterStudy] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Modal state ──
  const [viewPatient, setViewPatient] = useState<ActivePatient | null>(null);
  const [editPatient, setEditPatient] = useState<ActivePatient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActivePatient | null>(null);
  const [addPatientOpen, setAddPatientOpen] = useState(false);

  // The sidebar's "Add Patient" shortcut signals through a CustomEvent
  // (this page is already mounted) and sessionStorage (this page mounts
  // fresh after navigating in from elsewhere) instead of a URL param, so
  // the address bar never flashes a query string, and closing the modal
  // then clicking the shortcut again always works (a URL param that never
  // gets cleared would go stale after the first close).
  useEffect(() => {
    const openAddPatient = () => setAddPatientOpen(true);
    if (sessionStorage.getItem(OPEN_ADD_PATIENT_SIGNAL) === "1") {
      sessionStorage.removeItem(OPEN_ADD_PATIENT_SIGNAL);
      openAddPatient();
    }
    window.addEventListener(OPEN_ADD_PATIENT_SIGNAL, openAddPatient);
    return () =>
      window.removeEventListener(OPEN_ADD_PATIENT_SIGNAL, openAddPatient);
  }, []);

  // search debouncing
  const [debouncedSearch] = useDebounce(search, 150);

  // Data fetching with react-query
  const {
    data: response,
    isLoading,
    isFetching,
  } = usePatients({
    keyword: debouncedSearch || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    doctor_id: filterDoctor !== "all" ? filterDoctor : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page: currentPage,
  });

  // memoize patients list and total pages to avoid unnecessary re-renders
  const patients = response?.data ?? [];
  const totalPages = response?.pages ?? 1;

  // mutations
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();

  // Active filters count
  // useMemo to reduce calculations on every render
  const activeFilters = useMemo(
    () =>
      [
        filterStudy !== "all",
        filterDoctor !== "all",
        !!filterDate,
        sortDate !== "newest",
      ].filter(Boolean).length,
    [filterStudy, filterDoctor, filterDate, sortDate],
  );

  // Helpers to avoid rendering PatientsTable on every keystroke or filter change. They update the URL search params which in turn triggers data refetch in usePatients hook.
  // constant reference
  const resetPage = useCallback(() => {
    // useref or router.push with search params
    router.push(pathname);
  }, [pathname, router]);

  // handlers with useCallback to avoid unnecessary re-renders of child components that depend on them
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      resetPage();
    },
    [resetPage],
  );

  // study filter
  const handleSetFilterStudy = useCallback(
    (v: string) => {
      setFilterStudy(v);
      resetPage();
    },
    [resetPage],
  );

  // date filter
  const handleSetFilterDate = useCallback(
    (v: string) => {
      setFilterDate(v);
      resetPage();
    },
    [resetPage],
  );

  // doctor filter
  const handleSetFilterDoctor = useCallback(
    (v: string) => {
      setFilterDoctor(v);
      resetPage();
    },
    [resetPage],
  );

  // sort filter
  const handleSetSortDate = useCallback(
    (v: "newest" | "oldest") => {
      setSortDate(v);
      resetPage();
    },
    [resetPage],
  );

  // Mutation handlers
  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) deletePatient(deleteTarget.national_id);
    setDeleteTarget(null);
  }, [deleteTarget, deletePatient]);

  const handleSaveEdit = useCallback(
    (
      national_id: string,
      payload: Parameters<typeof updatePatient>[0]["payload"],
    ) => {
      updatePatient({ national_id, payload });
      setEditPatient(null);
    },
    [updatePatient],
  );

  // render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <ReceptionPageShell
        title="Active Patients"
        description="List of all active patients in the system at the moment of your visit."
      >
        <NavigationTabs
          tabs={PATIENT_TABS}
          active="active"
          onChange={(tab: PatientTab) => {
            if (tab === "historical") router.push("/receptionist/historical-data");
          }}
        />
        <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              placeholder="Search by name or National ID..."
              className="pl-9 h-10 text-sm"
              value={search}
              onChange={handleSearchChange}
            />
            {isFetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#059669] border-t-transparent animate-spin" />
            )}
          </div>

          <Button
            variant="outline"
            className={cn("gap-2 text-gray-600", activeFilters > 0 && "")}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200 text-[10px] text-emerald-900 font-bold">
                {activeFilters}
              </span>
            )}
          </Button>

          <Button onClick={() => setAddPatientOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>

        {/* ── Table ── */}
        <PatientsDataTable
          patients={patients}
          onView={setViewPatient}
          onEdit={setEditPatient}
          onDelete={setDeleteTarget}
        />

        {patients.length > 0 && (
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={{ page: String(currentPage) }}
          />
        )}

        {/* ── Modals ── */}
        <ActiveFiltersModal
          open={filtersOpen}
          onOpenChange={(v) => setFiltersOpen(v)}
          filterStudy={filterStudy}
          setFilterStudy={handleSetFilterStudy}
          filterDate={filterDate}
          setFilterDate={handleSetFilterDate}
          sortDate={sortDate}
          setSortDate={handleSetSortDate}
          filterDoctor={filterDoctor}
          setFilterDoctor={handleSetFilterDoctor}
        />

        <ViewPatientModal
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
        />
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSave={handleSaveEdit}
          isPending={isUpdating}
        />
        <DeletePatientModal
          patient={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
        <AddPatientModal
          open={addPatientOpen}
          onOpenChange={setAddPatientOpen}
        />
      </ReceptionPageShell>
    </>
  );
}
