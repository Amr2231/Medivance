"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import {
  LayoutList,
  GitBranch,
  ArrowUpDown,
  CalendarDaysIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  TableToolbar,
  ReceptionLoadingState,
  StatusBadge,
  PriorityBadge,
} from "../shared/ui";
import { AppointmentDetailsPanel } from "./appointment-details-panel";
import {
  useTodayAppointments,
  useUpdateAppointmentStatus,
} from "../../hooks";
import { APPOINTMENT_STATUSES, PRIORITY_LEVELS } from "../../constants";
import type { Appointment } from "@/lib/types/receptionist-operations";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { TableCard } from "@/components/shared/table-card";
import { PatientAvatar } from "@/components/shared/patient-avatar";

export function AppointmentsPage() {
  const [view, setView] = useState<"table" | "timeline">("table");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const sort = "time";
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      status: status || undefined,
      priority: priority || undefined,
      sort,
      order,
      page,
      limit: 10,
    }),
    [debouncedSearch, status, priority, sort, order, page],
  );

  const { data, isLoading } = useTodayAppointments(filters);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10);
  const statusCounts = APPOINTMENT_STATUSES.map((label) => ({ label, count: appointments.filter((appointment) => appointment.status === label).length })).filter((item) => item.count > 0);

  if (isLoading && !data) return <ReceptionLoadingState />;

  return (
    <>
      <ReceptionPageShell
        title="Today's Appointments"
        description="Manage check-ins, queue status, and consultation flow"
        actions={
          <div className="flex w-full sm:w-auto gap-1 rounded-lg border p-1 overflow-x-auto">
            <Button
              size="sm"
              className="flex-1 sm:flex-none whitespace-nowrap"
              variant={view === "table" ? "default" : "ghost"}
              onClick={() => setView("table")}
            >
              <LayoutList className="w-4 h-4 mr-1" /> Table
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none whitespace-nowrap"
              variant={view === "timeline" ? "default" : "ghost"}
              onClick={() => setView("timeline")}
            >
              <GitBranch className="w-4 h-4 mr-1" /> Timeline
            </Button>
          </div>
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-1">{statusCounts.map((item) => <button key={item.label} type="button" onClick={() => { setStatus(status === item.label ? "" : item.label); setPage(1); }} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors", status === item.label ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "bg-card hover:bg-muted")}><StatusBadge label={item.label}/><span className="font-mono font-semibold">{item.count}</span></button>)}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <TableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            searchPlaceholder="Search patients..."
            className="flex-1"
          />
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setStatus(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPOINTMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority || "all"}
            onValueChange={(v) => {
              setPriority(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITY_LEVELS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            {sort} {order}
          </Button>
        </div>

        <AnimatePresence mode="wait">
        {view === "table" ? (
          <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <TableCard>
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50 dark:border-gray-800">
                <tr>
                  <th className="text-left px-3 py-3 pl-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Time</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Patient</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    Doctor
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    Priority
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      <EmptyState
                        title="No appointments found"
                        description="Try adjusting your search or filters to find what you're looking for."
                        icon={CalendarDaysIcon}
                      />
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <motion.tr
                      key={a.appointment_id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors cursor-pointer"
                      onClick={() => setSelected(a)}
                    >
                      <td className="px-3 py-3 pl-4 font-mono">
                        {String(a.appointment_time).slice(0, 5)}
                      </td>
                      <td className="px-3 py-3"><div className="flex items-center gap-3"><PatientAvatar firstName={a.patient_name.split(" ")[0]} lastName={a.patient_name.split(" ").slice(1).join(" ")} study={null} className="size-8 text-[10px]"/><div><p className="font-medium">{a.patient_name}</p><p className="text-xs text-muted-foreground sm:hidden">{a.doctor_name}</p></div></div></td>
                      <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">
                        {a.doctor_name}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge label={a.status} />
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <PriorityBadge label={a.priority_level} />
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        {a.status === "Scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus({
                                id: a.appointment_id,
                                status: "Checked In",
                              })
                            }
                          >
                            Check In
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </TableCard>
          </motion.div>
        ) : (
          <motion.div key="timeline" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} className="overflow-hidden rounded-2xl border bg-card">
            <div className="border-b bg-muted/35 px-5 py-4"><p className="text-sm font-semibold">Day timeline</p><p className="text-xs text-muted-foreground">Appointments arranged by time — select one to open its operational detail.</p></div>
          <div className="relative divide-y">
            {appointments.map((a) => (
              <div
                key={a.appointment_id}
                className={cn(
                  "relative grid grid-cols-[74px_1fr] gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-muted/40",
                  selected?.appointment_id === a.appointment_id &&
                    "ring-2 ring-[#059669]/30",
                )}
                onClick={() => setSelected(a)}
              >
                <div className="border-r pr-4 text-right"><p className="font-mono text-sm font-bold">{String(a.appointment_time).slice(0, 5)}</p><p className="mt-1 text-[10px] uppercase text-muted-foreground">{a.duration_minutes} min</p></div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{a.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.doctor_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge label={a.status} />
                    <PriorityBadge label={a.priority_level} />
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <EmptyState
                title="No appointments found"
                description="Try adjusting your search or filters to find what you're looking for."
                icon={CalendarDaysIcon}
              />
            )}
          </div></motion.div>
        )}
        </AnimatePresence>

        {/* <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        /> */}
        {totalPages > 1 && (
          <PaginationWrapper
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </ReceptionPageShell>

      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelected(null)}
          />
          <AppointmentDetailsPanel
            appointment={selected}
            onClose={() => setSelected(null)}
          />
        </>
      )}
    </>
  );
}
