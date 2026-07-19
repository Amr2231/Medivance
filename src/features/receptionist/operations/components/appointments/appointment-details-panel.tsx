"use client";

import type { Appointment } from "@/lib/types/receptionist-operations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Clock, Phone, Stethoscope, Hash, Timer } from "lucide-react";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { StatusBadge, PriorityBadge } from "../shared/ui";
import {
  useAppointmentTimeline,
  useUpdateAppointmentStatus,
  useUpdateAppointmentPriority,
} from "../../hooks";
import { QUICK_ACTIONS, PRIORITY_LEVELS } from "../../constants";

type Props = {
  appointment: Appointment | null;
  onClose: () => void;
};

export function AppointmentDetailsPanel({ appointment, onClose }: Props) {
  const { mutate: updateStatus, isPending } = useUpdateAppointmentStatus();
  const { mutate: updatePriority } = useUpdateAppointmentPriority();
  const { data: timelineData } = useAppointmentTimeline(
    appointment?.appointment_id ?? 0,
  );

  if (!appointment) return null;

  const actions = QUICK_ACTIONS[appointment.status] ?? [];

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
        <div>
          <h2 className="font-semibold text-base">Appointment Details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ID #{appointment.appointment_id}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Patient Hero */}
        <div className="px-5 py-4 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold leading-tight">
                {appointment.patient_name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {appointment.national_id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <StatusBadge label={appointment.status} />
              <PriorityBadge label={appointment.priority_level} />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-5 py-4 border-b">
          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              icon={Stethoscope}
              label="Doctor"
              value={appointment.doctor_name}
            />
            <InfoItem
              icon={Clock}
              label="Time"
              value={String(appointment.appointment_time).slice(0, 5)}
              mono
            />
            <InfoItem
              icon={Phone}
              label="Phone"
              value={appointment.phone_number}
            />
            <InfoItem
              icon={Timer}
              label="Duration"
              value={`${appointment.duration_minutes} min`}
            />
            {appointment.queue_position && (
              <InfoItem
                icon={Hash}
                label="Queue Position"
                value={`#${appointment.queue_position}`}
                highlight
              />
            )}
            {appointment.estimated_wait_minutes != null && (
              <InfoItem
                icon={Clock}
                label="Est. Wait"
                value={`${appointment.estimated_wait_minutes} min`}
              />
            )}
          </div>
        </div>

        {/* Reason */}
        {appointment.reason && (
          <div className="px-5 py-4 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Reason
            </p>
            <p className="text-sm leading-relaxed">{appointment.reason}</p>
          </div>
        )}

        {/* Priority */}
        <div className="px-5 py-4 border-b">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Priority
          </p>
          <Select
            value={appointment.priority_level}
            onValueChange={(v) =>
              updatePriority({
                id: appointment.appointment_id,
                priority_level: v,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_LEVELS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="px-5 py-4 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Quick Actions
            </p>
            <div className="flex flex-col gap-2">
              {actions.map((a) => (
                <Button
                  key={a.next}
                  variant={
                    a.variant === "destructive" ? "destructive" : "default"
                  }
                  className="w-full"
                  disabled={isPending}
                  onClick={() =>
                    updateStatus({
                      id: appointment.appointment_id,
                      status: a.next,
                    })
                  }
                >
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {timelineData?.timeline && timelineData.timeline.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Timeline
            </p>
            <ol className="space-y-0">
              {timelineData.timeline.map((ev, i) => {
                const isLast = i === timelineData.timeline.length - 1;
                return (
                  <li key={i} className="flex gap-3">
                    {/* Dot + Line */}
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#059669]" />
                      {!isLast && (
                        <span className="w-px flex-1 bg-border my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                      <p className="text-sm font-medium leading-tight">
                        {ev.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatFullTimestamp(ev.at)}
                      </p>
                      {ev.detail && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {ev.detail}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}

// Helper component for info items
function InfoItem({
  icon: Icon,
  label,
  value,
  mono,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""} ${
            highlight ? "text-[#059669]" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
