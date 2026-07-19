"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  DoctorStatusBadge,
  PriorityBadge,
  ReceptionLoadingState,
  StatusBadge,
} from "../shared/ui";
import { useReceptionDashboard } from "../../hooks";

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { data, isLoading, isError } = useReceptionDashboard();
  if (isLoading) return <ReceptionLoadingState />;
  if (isError || !data)
    return (
      <ReceptionPageShell title="Reception command center">
        <p className="text-sm text-destructive">
          Unable to load the live operations overview.
        </p>
      </ReceptionPageShell>
    );

  const {
    metrics,
    live_queue: queue,
    upcoming,
    doctors,
    priority_overview,
  } = data;
  const flowTotal = Math.max(metrics.total_today, 1);
  const flow = [
    {
      label: "Checked in",
      value: metrics.checked_in,
      icon: UserCheck,
      tone: "text-cyan-600",
    },
    {
      label: "Waiting",
      value: metrics.waiting,
      icon: Clock3,
      tone: "text-amber-600",
    },
    {
      label: "In consultation",
      value: metrics.in_consultation,
      icon: Stethoscope,
      tone: "text-violet-600",
    },
    {
      label: "Completed",
      value: metrics.completed,
      icon: CheckCircle2,
      tone: "text-emerald-600",
    },
  ];

  return (
    <ReceptionPageShell
      title="Reception command center"
      description="The live picture of today’s patient flow — updated automatically."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/receptionist/appointments">Manage appointments</Link>
          </Button>
          <Button asChild>
            <Link href="/receptionist/scheduling">Schedule patient</Link>
          </Button>
        </div>
      }
    >
      <motion.section
        {...cardMotion}
        className="overflow-hidden rounded-2xl border bg-card"
      >
        <div className="grid lg:grid-cols-[1.35fr_.65fr]">
          <div className="p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">
              Today’s overview
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-semibold tracking-tight tabular-nums">
                  {metrics.total_today}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  appointments on today’s operating list
                </p>
              </div>
              <div className="rounded-xl bg-muted px-4 py-3 text-sm">
                <span className="font-semibold text-foreground">
                  {metrics.no_shows}
                </span>{" "}
                no-shows need follow-up
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {flow.map(({ label, value, icon: Icon, tone }, index) => (
                <div key={`flow-${label}-${index}`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className={`size-3.5 ${tone}`} />
                    {label}
                  </div>
                  <p className="mt-1 font-mono text-2xl font-bold">{value}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / flowTotal) * 100}%` }}
                      className={`h-full rounded-full ${tone.replace("text", "bg")}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t bg-muted/35 p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600" />
              <p className="text-sm font-semibold">Operational attention</p>
            </div>
            <div className="mt-5 space-y-3">
              <AlertRow
                text={`${metrics.waiting} patients are waiting`}
                href="/receptionist/arrival-board"
              />
              <AlertRow
                text={`${metrics.no_shows} appointments need a no-show action`}
                href="/receptionist/appointments"
              />
              <AlertRow
                text={`${priority_overview.reduce((count, item) => count + (item.priority_level === "Normal" ? 0 : item.count), 0)} elevated-priority patients`}
                href="/receptionist/arrival-board"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <motion.section
          {...cardMotion}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border bg-card"
        >
          <SectionHeading
            title="Live patient flow"
            action="Open command center"
            href="/receptionist/arrival-board"
          />
          <div className="divide-y">
            {queue.length ? (
              queue.slice(0, 6).map((item, index) => (
                <div
                  key={`queue-${item.queue_id}-${item.appointment_id}-${index}`}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-emerald-50 font-mono text-sm font-bold text-emerald-700">
                    {item.queue_position}
                  </span>
                  <PatientAvatar
                    firstName={item.patient_name.split(" ")[0]}
                    lastName={item.patient_name.split(" ").slice(1).join(" ")}
                    study={null}
                    className="size-8 text-[10px]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.patient_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.doctor_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PriorityBadge label={item.priority_level} />
                    <StatusBadge label={item.board_status} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Users}
                title="Queue is clear"
                description="No patients are currently waiting."
              />
            )}
          </div>
        </motion.section>
        <motion.section
          {...cardMotion}
          transition={{ delay: 0.14 }}
          className="rounded-2xl border bg-card"
        >
          <SectionHeading
            title="Next appointments"
            action="View day"
            href="/receptionist/appointments"
          />
          <div className="divide-y">
            {upcoming.length ? (
              upcoming.slice(0, 5).map((appointment, index) => (
                <div
                  key={`upcoming-${appointment.appointment_id}-${index}`}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <time className="w-11 font-mono text-sm font-semibold">
                    {String(appointment.appointment_time).slice(0, 5)}
                  </time>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {appointment.patient_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {appointment.doctor_name}
                    </p>
                  </div>
                  <StatusBadge label={appointment.status} />
                </div>
              ))
            ) : (
              <EmptyState
                icon={CalendarCheck}
                title="No upcoming appointments"
                description="The schedule is clear."
              />
            )}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.section
          {...cardMotion}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card p-5"
        >
          <SectionHeading title="Doctor availability" />
          <div className="mt-3 grid gap-2">
            {doctors.map((doctor, index) => (
              <div
                key={`doctor-${doctor.doctor_id}-${index}`}
                className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{doctor.doctor_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.workload_count} patients in workload
                  </p>
                </div>
                <DoctorStatusBadge label={doctor.status} />
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section
          {...cardMotion}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border bg-card p-5"
        >
          <SectionHeading title="Priority watch" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {priority_overview.map((item, index) => (
              <div
                key={`priority-${item.priority_level}-${index}`}
                className="rounded-xl bg-muted/55 p-3"
              >
                <PriorityBadge label={item.priority_level} />
                <p className="mt-3 font-mono text-2xl font-bold">
                  {item.count}
                </p>
                <p className="text-xs text-muted-foreground">in queue</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </ReceptionPageShell>
  );
}

function SectionHeading({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {action && href ? (
        <Link
          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
          href={href}
        >
          {action}
          <ArrowRight className="size-3" />
        </Link>
      ) : null}
    </div>
  );
}
function AlertRow({ text, href }: { text: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border bg-background px-3 py-3 text-sm transition-transform hover:-translate-y-0.5"
    >
      <span>{text}</span>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
