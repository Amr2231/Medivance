import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { SchedulingResult } from "@/lib/types/receptionist-operations";
import { confidenceWidth, formatSlotTime } from "../utils/scheduling-utils";

type Props = {
  scheduling: SchedulingResult | undefined;
  nationalId: string;
  bookedTimes: string[];
  bookingLocked: boolean;
  isBooking: boolean;
  onBook: (time: string) => void;
};
export function SchedulingResults({
  scheduling,
  nationalId,
  bookedTimes,
  bookingLocked,
  isBooking,
  onBook,
}: Props) {
  if (!scheduling)
    return (
      <div className="rounded-xl border border-dashed p-14 text-center">
        <Calendar className="mx-auto mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Select a doctor and date, then request slot suggestions
        </p>
      </div>
    );
  return (
    <div className="min-w-0 space-y-4">
      {scheduling.warnings.map((warning, index) => (
        <div
          key={`${warning.type}-${index}`}
          className="flex gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          {warning.message}
        </div>
      ))}
      {scheduling.suggestions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10">
          <EmptyState
            icon={CalendarCheck}
            title="No Suggested Slots"
            description="We couldn't find any slots that match your preferences."
          />
        </div>
      ) : (
        <div className="grid gap-3">
          {scheduling.suggestions.map((slot) => (
            <div
              key={slot.appointment_time}
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <span className="font-mono text-lg font-bold">
                      {formatSlotTime(slot.appointment_time)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{slot.doctor_name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Match score:{" "}
                      <span className="font-semibold text-emerald-900">
                        {slot.score}/100
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={
                    isBooking ||
                    bookingLocked ||
                    bookedTimes.includes(slot.appointment_time) ||
                    nationalId.length !== 14
                  }
                  onClick={() => onBook(slot.appointment_time)}
                >
                  {bookedTimes.includes(slot.appointment_time)
                    ? "Booked"
                    : isBooking
                      ? "Booking…"
                      : "Book"}
                </Button>
              </div>
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Schedule fit confidence</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    {slot.score}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-700"
                    style={{ width: confidenceWidth(slot.score) }}
                  />
                </div>
              </div>
              {slot.reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t pt-3">
                  {slot.reasons.map((reason, index) => (
                    <li
                      key={`${reason}-${index}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="size-3.5 shrink-0 text-green-600" />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {scheduling.alternatives.length > 0 && (
        <div className="pt-2">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Alternative dates
          </p>
          <div className="flex flex-wrap gap-2">
            {scheduling.alternatives.map((alternative) => (
              <div
                key={alternative.date}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="font-medium">{alternative.date}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatSlotTime(alternative.top_slot.appointment_time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
