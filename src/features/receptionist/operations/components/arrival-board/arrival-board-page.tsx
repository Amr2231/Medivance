"use client";

import { useMemo, useState } from "react";
import { Clock, Users, Stethoscope, Timer, BellRing } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import { ReceptionLoadingState } from "../shared/ui";
import { useArrivalBoard, useCallPatient, useTodayAppointments } from "../../hooks";
import {
  BOARD_STATUSES,
  PRIORITY_COLORS,
  STATUS_COLORS,
} from "../../constants";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import { PatientAvatar } from "@/components/shared/patient-avatar";

//  Status styling
const STATUS_CARD_STYLE: Record<string, string> = {
  Called: "border-l-4 border-l-amber-400 bg-amber-50/40 dark:bg-amber-950/20",
  "In Consultation":
    "border-l-4 border-l-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20",
  Waiting: "border-l-4 border-l-[#059669]/60",
  "Checked In": "border-l-4 border-l-teal-400",
};

//  Stat card
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
        <Icon className="h-4 w-4 text-emerald-800" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-none text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

// Priority badge
function PriorityBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        PRIORITY_COLORS[label] ?? "bg-gray-100 text-gray-700 border-gray-200",
      )}
    >
      {label}
    </span>
  );
}

// Status badge
function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[label] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {label}
    </span>
  );
}

// Main page
export function ArrivalBoardPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState("");

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
    }),
    [debouncedSearch, status],
  );

  const {
    data: entries = [],
    isLoading,
    isFetching,
  } = useArrivalBoard(filters);
  const { mutate: callPatient, isPending: isCalling } = useCallPatient();
  const { data: appointmentsData } = useTodayAppointments({ limit: 100 });
  const phonesByAppointment = useMemo(
    () => new Map((appointmentsData?.data ?? []).map((appointment) => [appointment.appointment_id, appointment.phone_number])),
    [appointmentsData?.data],
  );

  const showInitialLoader = isLoading && entries.length === 0;

  // derived stats
  const inQueue = entries.filter((e) =>
    ["Waiting", "Checked In"].includes(e.board_status),
  ).length;

  const inConsult = entries.filter(
    (e) => e.board_status === "In Consultation",
  ).length;

  const waitTimes = entries
    .map((e) => e.waiting_minutes)
    .filter((m): m is number => typeof m === "number" && m > 0);

  const avgWait =
    waitTimes.length > 0
      ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length)
      : 0;

  if (showInitialLoader) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Patient Arrival Board"
      description="Live operations display — updates in real time"
    >
      {/*  Stats row  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <StatCard icon={Users} label="In queue" value={inQueue} />
        <StatCard
          icon={Stethoscope}
          label="In consultation"
          value={inConsult}
        />
        <StatCard icon={Timer} label="Avg wait" value={`${avgWait}m`} />
      </div>

      {/*  Filters  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          placeholder="Search patient name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
          aria-busy={isFetching}
        />
        <Select
          value={status || "all"}
          onValueChange={(v) => setStatus(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {BOARD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Board  */}
      <div className="rounded-xl border bg-card">
        {/* header */}
        <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {" "}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-800 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-800" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Now Serving
            </span>
          </div>
          <span className="text-xs text-muted-foreground break-words">
            Medivance Hospital · Front Desk
          </span>
        </div>

        {/* list */}
        {entries.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients found"
            description="There are no patients currently in the queue."
          />
        ) : (
          <div className="divide-y">
            {entries.map((e) => {
              const phoneNumber = phonesByAppointment.get(e.appointment_id);
              return (
              <motion.div
                key={e.queue_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center transition-colors",
                  STATUS_CARD_STYLE[e.board_status] ?? "",
                  e.board_status === "Called" && "animate-pulse",
                )}
              >
                {/* queue number */}
                <span className="w-10 text-center text-2xl font-semibold tabular-nums text-[#059669]/30">
                  {String(e.queue_position).padStart(2, "0")}
                </span>

                {/* patient info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <PatientAvatar
                    firstName={e.patient_name.split(" ")[0]}
                    lastName={e.patient_name.split(" ").slice(1).join(" ")}
                    study={null}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-foreground">
                      {e.patient_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {e.doctor_name}
                    </p>
                  </div>
                </div>

                {/* right side */}
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusBadge label={e.board_status} />
                  <PriorityBadge label={e.priority_level} />

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {e.waiting_minutes}m wait
                    </span>
                    {e.estimated_wait_minutes != null && (
                      <span>Est. {e.estimated_wait_minutes}m</span>
                    )}
                  </div>
                </div>
                {e.board_status !== "In Consultation" && e.board_status !== "Completed" && phoneNumber && (
                  <Button asChild size="sm" variant={e.board_status === "Called" ? "outline" : "default"} disabled={isCalling || e.board_status === "Called"} className="gap-1.5 self-start sm:self-auto">
                    <a href={`tel:${phoneNumber}`} onClick={() => callPatient(e.appointment_id)} aria-label={`Call ${e.patient_name} at ${phoneNumber}`}>
                    <BellRing className="size-3.5" /> {e.board_status === "Called" ? "Called" : "Call"}
                    </a>
                  </Button>
                )}
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ReceptionPageShell>
  );
}
