"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  FileText,
  Printer,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerItem } from "@/lib/motion/variants";
import { formatTimeOnly } from "@/lib/utils/date-format";
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
} from "../shared/ui";
import { useDoctorDashboard } from "../../hooks/use-dashboard";
import { AvailabilityEditor } from "./availability-editor";
import type {
  DoctorScheduleItem,
  DoctorWatchlistPreview,
} from "@/lib/types/doctor-portal";

// types
type ScheduleTab = "today" | "availability";

// status -> badge style
const STATUS_CONFIG: Record<string, string> = {
  completed: "bg-muted text-muted-foreground border-border",
  "in progress":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  scheduled:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

function statusBadgeClass(status: string) {
  return (
    STATUS_CONFIG[status.toLowerCase()] ??
    "bg-muted text-muted-foreground border-border"
  );
}

// Priority is derived from the doctor's own watchlist — a patient flagged
// "critical" there needs to jump out on today's roster too, instead of
// inventing a separate priority field the API doesn't have.
function priorityFor(
  nationalId: string,
  watchlist: DoctorWatchlistPreview[],
): { label: string; className: string } {
  const entry = watchlist.find((w) => w.national_id === nationalId);
  if (entry?.priority === "critical") {
    return {
      label: "Critical",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    };
  }
  if (entry?.priority === "monitor") {
    return {
      label: "Monitor",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    };
  }
  return {
    label: "Routine",
    className: "bg-muted text-muted-foreground border-border",
  };
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

// A single row in the Clinical Roster table
function AppointmentRow({
  item,
  watchlist,
}: {
  item: DoctorScheduleItem;
  watchlist: DoctorWatchlistPreview[];
}) {
  const isCompleted = item.status.toLowerCase() === "completed";
  const priority = priorityFor(item.national_id, watchlist);

  return (
    <TableRow className="border-b border-border transition-colors hover:bg-muted/40">
      <TableCell className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
        {formatTimeOnly(item.study_date)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="text-xs font-semibold">
              {initials(item.first_name, item.last_name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium text-foreground">
            {item.first_name} {item.last_name}
          </p>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {item.national_id}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {item.study_type}
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            priority.className,
          )}
        >
          {priority.label}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            statusBadgeClass(item.status),
          )}
        >
          {item.status}
        </span>
      </TableCell>
      <TableCell className="pr-4 text-right">
        {isCompleted ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={`/doctor/patients/${item.study_id}/report`}>
              <FileText className="size-3.5" />
              View Report
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="ghost">
            <Link href={`/doctor/patients/profile/${item.national_id}`}>
              <User className="size-3.5" />
              Open Profile
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

// component
export function SchedulePage() {
  // hooks
  const [tab, setTab] = useState<ScheduleTab>("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useDoctorDashboard();
  const schedule = useMemo(() => data?.today_schedule ?? [], [data?.today_schedule]);
  const watchlist = useMemo(() => data?.watchlist ?? [], [data?.watchlist]);

  const sortedSchedule = useMemo(
    () =>
      schedule
        .slice()
        .sort(
          (a, b) =>
            new Date(a.study_date).getTime() - new Date(b.study_date).getTime(),
        ),
    [schedule],
  );

  const upcoming = sortedSchedule.filter((s) => s.status !== "Completed");
  const completed = sortedSchedule.filter((s) => s.status === "Completed");
  const urgentToday = sortedSchedule.filter(
    (s) => priorityFor(s.national_id, watchlist).label === "Critical",
  );
  const nextUp = upcoming[0];

  const availableStatuses = useMemo(
    () => Array.from(new Set(sortedSchedule.map((s) => s.status))),
    [sortedSchedule],
  );

  const visibleSchedule =
    statusFilter === "all"
      ? sortedSchedule
      : sortedSchedule.filter((s) => s.status === statusFilter);

  const completionPct =
    sortedSchedule.length === 0
      ? 0
      : Math.round((completed.length / sortedSchedule.length) * 100);

  if (isLoading && tab === "today") return <DoctorLoadingState />;

  // render
  return (
    <DoctorPageShell
      title="Schedule"
      description="Today's appointments and your booking availability"
      actions={
        tab === "today" && sortedSchedule.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="size-3.5" />
            Print Roster
          </Button>
        ) : undefined
      }
    >
      {/* tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(
          [
            ["today", "Today's appointments"],
            ["availability", "Availability settings"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={tab === id ? "default" : "ghost"}
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === "availability" ? (
        <AvailabilityEditor />
      ) : isError ? (
        <DoctorErrorState onRetry={() => refetch()} />
      ) : (
        <>
          {/* at-a-glance cards */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {/* Patients Remaining */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Patients Remaining
                </p>
                <span className="flex size-8 items-center justify-center rounded-full bg-[image:var(--brand-gradient-soft)]">
                  <Users className="size-4 text-emerald-700 dark:text-emerald-300" />
                </span>
              </div>
              <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                {upcoming.length}
                <span className="text-base font-medium text-muted-foreground">
                  {" "}
                  / {sortedSchedule.length} Total
                </span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 dark:bg-emerald-400"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Urgent Cases */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Urgent Cases
                </p>
                <span className="flex size-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                  <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
                </span>
              </div>
              <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                {urgentToday.length}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    urgentToday.length > 0 ? "bg-red-600" : "bg-emerald-600",
                  )}
                />
                {urgentToday.length > 0
                  ? "Needs immediate attention"
                  : "No urgent cases right now"}
              </p>
            </div>

            {/* Next Up */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Next Up
                </p>
                <span className="flex size-8 items-center justify-center rounded-full bg-[image:var(--brand-gradient-soft)]">
                  <CalendarCheck className="size-4 text-emerald-700 dark:text-emerald-300" />
                </span>
              </div>
              {nextUp ? (
                <>
                  <p className="text-lg font-bold text-foreground">
                    {nextUp.first_name} {nextUp.last_name}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatTimeOnly(nextUp.study_date)} · {nextUp.study_type}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              )}
            </div>
          </motion.div>

          {/* Clinical Roster */}
          {sortedSchedule.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-10">
              <EmptyState
                icon={CalendarCheck}
                title="No schedule for today"
                description="New images will appear here when assigned."
              />
            </div>
          ) : (
            <motion.section
              variants={staggerItem}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border p-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Clinical Roster
                </h2>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {availableStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Time
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Patient Info
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      MRN
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Priority
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="pr-4 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleSchedule.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center">
                        <EmptyState
                          icon={CalendarCheck}
                          title="No appointments match this status"
                          description="Try selecting a different status filter."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleSchedule.map((item) => (
                      <AppointmentRow
                        key={item.study_id}
                        item={item}
                        watchlist={watchlist}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </motion.section>
          )}
        </>
      )}
    </DoctorPageShell>
  );
}
