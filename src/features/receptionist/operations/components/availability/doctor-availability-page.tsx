"use client";

import { ReceptionPageShell } from "../shared/reception-page-shell";
import { ReceptionLoadingState, DoctorStatusBadge } from "../shared/ui";
import { useDoctorsAvailability } from "../../hooks";

export function DoctorAvailabilityPage() {
  const { data: doctors = [], isLoading } = useDoctorsAvailability();

  if (isLoading) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Doctor Availability"
      description="Live doctor status, workload, and next available slots"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <div key={d.doctor_id} className="rounded-xl border p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-lg">{d.doctor_name}</p>
                <p className="text-sm text-muted-foreground">
                  {d.today_appointments ?? 0} appointments today
                </p>
              </div>
              <DoctorStatusBadge label={d.status} />
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Workload</dt>
                <dd className="font-semibold tabular-nums">
                  {d.workload_count}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Next Slot</dt>
                <dd className="font-mono text-xs truncate">
                  {d.next_available_slot
                    ? String(d.next_available_slot)
                        .replace("T", " ")
                        .slice(0, 16)
                    : "—"}
                </dd>
              </div>
            </dl>
            {d.break_until && (
              <p className="text-xs text-orange-600">
                Break until {String(d.break_until).slice(11, 16)}
              </p>
            )}
          </div>
        ))}
      </div>
    </ReceptionPageShell>
  );
}
