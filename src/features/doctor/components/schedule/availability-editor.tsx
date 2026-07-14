"use client";

import { useMemo, useState } from "react";
import { CalendarOff, Clock, Plane, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  useAddDoctorHoliday,
  useDoctorAvailability,
  useRemoveDoctorHoliday,
  useSaveDoctorAvailability,
} from "../../hooks/use-doctor-schedule";
import type { DoctorScheduleDay } from "../../api/schedule.api";
import { DoctorLoadingState } from "../shared/ui";
import { EmptyState } from "@/components/ui/empty-state";

// Monday-first display order, matching how doctors think about a clinic week.
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const ROW_HEIGHT = 48; // px per hour
const DEFAULT_BLOCK_MINUTES = 60;

// ── time helpers ─────────────────────────────────────────────────────────
function toTimeInput(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

function fromTimeInput(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

function timeToMinutes(value?: string | null): number | null {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

function minutesToTimeInput(mins: number) {
  const clamped = Math.max(0, Math.min(24 * 60, mins));
  const h = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const m = (clamped % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function formatHourLabel(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00 ${period}`;
}

function formatMinutesLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

// A day's working block, split around its break (if any) so the break
// shows up as a visible gap in the grid instead of a fabricated separate
// "block type" the API doesn't actually have.
function buildSegments(day: DoctorScheduleDay) {
  const start = timeToMinutes(day.start_time);
  const end = timeToMinutes(day.end_time);
  if (start == null || end == null || end <= start) return [];

  const breakStart = timeToMinutes(day.break_start);
  const breakEnd = timeToMinutes(day.break_end);
  if (
    breakStart != null &&
    breakEnd != null &&
    breakEnd > breakStart &&
    breakStart > start &&
    breakEnd < end
  ) {
    return [
      { startMin: start, endMin: breakStart },
      { startMin: breakEnd, endMin: end },
    ];
  }
  return [{ startMin: start, endMin: end }];
}

// Parses a "YYYY-MM-DD" string as a local calendar date instead of UTC
// midnight, so the badge never shows a day off by one in negative-UTC zones.
function parseHolidayDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return new Date(value);
  return new Date(y, m - 1, d);
}

// draft state shape used by the edit dialog
type Draft = {
  dayOfWeek: number;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
  slot: number;
  capacity: number;
};

// component
export function AvailabilityEditor() {
  // hooks
  const { data, isLoading } = useDoctorAvailability();
  const { mutate: save, isPending: isSaving } = useSaveDoctorAvailability();
  const { mutate: addHoliday, isPending: isAddingHoliday } =
    useAddDoctorHoliday();
  const { mutate: removeHoliday } = useRemoveDoctorHoliday();

  const serverDays = data?.days ?? [];
  const serverKey = JSON.stringify(serverDays);
  const [days, setDays] = useState<DoctorScheduleDay[]>(serverDays);
  const [loadedKey, setLoadedKey] = useState(serverKey);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isExistingBlock, setIsExistingBlock] = useState(false);

  if (serverKey !== loadedKey) {
    setDays(serverDays);
    setLoadedKey(serverKey);
  }

  const orderedDays = useMemo(
    () =>
      DAY_ORDER.map(
        (dow) => days.find((d) => d.day_of_week === dow) ?? null,
      ).filter((d): d is DoctorScheduleDay => d !== null),
    [days],
  );

  // Visible hour range is derived from the doctor's own active hours (with
  // a little padding), so the grid isn't hard-coded to hours nobody uses.
  const { startHour, endHour } = useMemo(() => {
    const starts = orderedDays
      .filter((d) => d.is_active)
      .map((d) => timeToMinutes(d.start_time))
      .filter((v): v is number => v != null);
    const ends = orderedDays
      .filter((d) => d.is_active)
      .map((d) => timeToMinutes(d.end_time))
      .filter((v): v is number => v != null);
    const minStart = starts.length ? Math.min(...starts) : 9 * 60;
    const maxEnd = ends.length ? Math.max(...ends) : 17 * 60;
    return {
      startHour: Math.max(0, Math.floor(minStart / 60) - 1),
      endHour: Math.min(24, Math.ceil(maxEnd / 60) + 1),
    };
  }, [orderedDays]);

  const hours = useMemo(
    () =>
      Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i),
    [startHour, endHour],
  );
  const gridHeight = (endHour - startHour) * ROW_HEIGHT;
  const gridStartMin = startHour * 60;
  const gridEndMin = endHour * 60;

  const updateDay = (dayOfWeek: number, patch: Partial<DoctorScheduleDay>) => {
    setDays((prev) =>
      prev.map((d) => (d.day_of_week === dayOfWeek ? { ...d, ...patch } : d)),
    );
  };

  // Opens the edit dialog for a fresh, doctor-picked time range on a given day.
  function openNewBlock(
    day: DoctorScheduleDay,
    startMin: number,
    endMin: number,
  ) {
    setIsExistingBlock(Boolean(day.is_active));
    setDraft({
      dayOfWeek: day.day_of_week,
      start: minutesToTimeInput(startMin),
      end: minutesToTimeInput(endMin),
      breakStart: toTimeInput(day.break_start),
      breakEnd: toTimeInput(day.break_end),
      slot: day.slot_duration_minutes,
      capacity: day.max_appointments,
    });
  }

  // Free-form click-to-pick: figure out where on the column the doctor
  // clicked, snap it to the nearest half hour, and open a one-hour block
  // starting there — no rigid preset slots to choose from.
  function handleColumnClick(
    e: React.MouseEvent<HTMLDivElement>,
    day: DoctorScheduleDay,
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const rawMinutes = gridStartMin + (offsetY / ROW_HEIGHT) * 60;
    const snapped = Math.round(rawMinutes / 30) * 30;
    const clampedStart = Math.min(
      Math.max(snapped, gridStartMin),
      gridEndMin - 30,
    );
    const clampedEnd = Math.min(
      clampedStart + DEFAULT_BLOCK_MINUTES,
      gridEndMin,
    );
    openNewBlock(day, clampedStart, clampedEnd);
  }

  function handleBlockClick(e: React.MouseEvent, day: DoctorScheduleDay) {
    e.stopPropagation();
    const start = timeToMinutes(day.start_time) ?? gridStartMin;
    const end = timeToMinutes(day.end_time) ?? gridStartMin + 60;
    openNewBlock(day, start, end);
  }

  function handleAddBlockButton() {
    const fallback =
      orderedDays.find((d) => d.is_active) ?? orderedDays[0] ?? null;
    if (!fallback) return;
    openNewBlock(fallback, 9 * 60, 17 * 60);
  }

  function confirmDraft() {
    if (!draft) return;
    if (fromTimeInput(draft.end) <= fromTimeInput(draft.start)) return;
    updateDay(draft.dayOfWeek, {
      is_active: true,
      start_time: fromTimeInput(draft.start),
      end_time: fromTimeInput(draft.end),
      break_start: draft.breakStart ? fromTimeInput(draft.breakStart) : null,
      break_end: draft.breakEnd ? fromTimeInput(draft.breakEnd) : null,
      slot_duration_minutes: draft.slot || 30,
      max_appointments: draft.capacity || 16,
    });
    setDraft(null);
  }

  function clearDraftDay() {
    if (!draft) return;
    updateDay(draft.dayOfWeek, { is_active: false });
    setDraft(null);
  }

  // loading state for availability tab
  if (isLoading) return <DoctorLoadingState />;

  return (
    <div className="space-y-6">
      {/* Weekly grid */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Weekly Availability
            </p>
            <p className="text-xs text-muted-foreground">
              Click any open slot to pick your own hours, or click a block to
              edit it.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddBlockButton}
            >
              <Plus className="size-3.5" />
              Add Block
            </Button>
            <Button size="sm" disabled={isSaving} onClick={() => save(days)}>
              <Save className="size-3.5" />
              {isSaving ? "Saving..." : "Save schedule"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid min-w-[720px]"
            style={{ gridTemplateColumns: "64px repeat(7, minmax(96px, 1fr))" }}
          >
            {/* corner */}
            <div className="border-b border-border" />
            {orderedDays.map((day) => (
              <div
                key={day.day_of_week}
                className="border-b border-l border-border px-1 py-2.5 text-center"
              >
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wide",
                    day.is_active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {(day.day_name ?? "").slice(0, 3)}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    updateDay(day.day_of_week, { is_active: !day.is_active })
                  }
                  className={cn(
                    "mt-0.5 text-[10px] font-medium",
                    day.is_active
                      ? "text-emerald-700 hover:underline dark:text-emerald-400"
                      : "text-muted-foreground hover:underline",
                  )}
                >
                  {day.is_active ? "Active" : "Off"}
                </button>
              </div>
            ))}

            {/* hour gutter */}
            <div className="relative" style={{ height: gridHeight }}>
              {hours.map((h) => (
                <span
                  key={h}
                  className="absolute right-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground"
                  style={{ top: (h - startHour) * ROW_HEIGHT }}
                >
                  {formatHourLabel(h)}
                </span>
              ))}
            </div>

            {/* day columns */}
            {orderedDays.map((day) => {
              const segments = buildSegments(day);
              return (
                <div
                  key={day.day_of_week}
                  role="button"
                  tabIndex={0}
                  title="Click to add availability"
                  onClick={(e) => handleColumnClick(e, day)}
                  className="relative cursor-pointer border-l border-border"
                  style={{ height: gridHeight }}
                >
                  {hours.map((h) => (
                    <div
                      key={h}
                      aria-hidden
                      className="absolute left-0 right-0 border-t border-border/60"
                      style={{ top: (h - startHour) * ROW_HEIGHT }}
                    />
                  ))}

                  {day.is_active ? (
                    segments.map((seg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => handleBlockClick(e, day)}
                        className="absolute left-1 right-1 overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-left transition-colors hover:brightness-95 dark:border-emerald-900 dark:bg-emerald-950/40"
                        style={{
                          top:
                            ((Math.max(seg.startMin, gridStartMin) -
                              gridStartMin) /
                              60) *
                            ROW_HEIGHT,
                          height: Math.max(
                            ((Math.min(seg.endMin, gridEndMin) -
                              Math.max(seg.startMin, gridStartMin)) /
                              60) *
                              ROW_HEIGHT,
                            22,
                          ),
                        }}
                      >
                        <span className="block truncate text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                          Clinic Hours
                        </span>
                        <span className="block truncate font-mono text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                          {formatMinutesLabel(seg.startMin)} –{" "}
                          {formatMinutesLabel(seg.endMin)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                      <span className="text-[10px] text-muted-foreground">
                        Day off
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holidays / leave */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div
          aria-hidden
          className="ambient-blob absolute -right-16 -top-20 size-56 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
                <Plane className="size-4 text-amber-700 dark:text-amber-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Holidays &amp; Leave
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Block specific dates from patient booking.
                </p>
              </div>
            </div>
            {(data?.holidays ?? []).length > 0 ? (
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                {data?.holidays?.length}{" "}
                {data?.holidays?.length === 1 ? "day" : "days"} blocked
              </span>
            ) : null}
          </div>

          {/* add-holiday bar */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-dashed border-border bg-muted/30 p-3 sm:flex-row sm:items-center">
            <Input
              type="date"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className="bg-card sm:max-w-45"
            />
            <Input
              value={holidayReason}
              onChange={(e) => setHolidayReason(e.target.value)}
              placeholder="Reason (optional) — e.g. Conference, PTO"
              className="bg-card"
            />
            <Button
              size="sm"
              className="shrink-0"
              disabled={!holidayDate || isAddingHoliday}
              onClick={() => {
                addHoliday(
                  {
                    holiday_date: holidayDate,
                    reason: holidayReason || undefined,
                  },
                  {
                    onSuccess: () => {
                      setHolidayDate("");
                      setHolidayReason("");
                    },
                  },
                );
              }}
            >
              <Plus className="size-3.5" />
              Add holiday
            </Button>
          </div>

          {/* holiday cards */}
          {(data?.holidays ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8">
              <EmptyState
                icon={CalendarOff}
                title="No holidays yet"
                description="Dates you add here will be closed to patient booking."
              />
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.holidays ?? [])
                .slice()
                .sort(
                  (a, b) =>
                    parseHolidayDate(a.holiday_date).getTime() -
                    parseHolidayDate(b.holiday_date).getTime(),
                )
                .map((holiday) => {
                  const parsed = parseHolidayDate(holiday.holiday_date);
                  const weekday = parsed.toLocaleDateString("en-GB", {
                    weekday: "short",
                  });
                  const day = parsed.toLocaleDateString("en-GB", {
                    day: "2-digit",
                  });
                  const month = parsed
                    .toLocaleDateString("en-GB", { month: "short" })
                    .toUpperCase();

                  return (
                    <li
                      key={holiday.holiday_id}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition-colors hover:border-amber-300 dark:hover:border-amber-800"
                    >
                      {/* mini calendar-tile badge */}
                      <div className="flex w-12 shrink-0 flex-col items-center overflow-hidden rounded-lg border border-amber-200 dark:border-amber-900">
                        <span className="w-full bg-amber-500 py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                          {month}
                        </span>
                        <span className="flex w-full flex-1 items-center justify-center bg-amber-50 py-1 font-mono text-base font-bold tabular-nums text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          {day}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">
                          {weekday}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {holiday.reason || "Blocked — no reason given"}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
                        onClick={() => removeHoliday(holiday.holiday_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>

      {/* Edit / add block dialog — this is where the doctor freely types the
          exact times they want, seeded from wherever they clicked. */}
      <Dialog
        open={draft !== null}
        onOpenChange={(open) => !open && setDraft(null)}
      >
        <DialogContent>
          {draft ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {isExistingBlock ? "Edit availability" : "Add availability"}
                </DialogTitle>
                <DialogDescription>
                  Set the exact hours you want to work — pick whatever times
                  suit you.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">Day</Label>
                  <Select
                    value={String(draft.dayOfWeek)}
                    onValueChange={(v) =>
                      setDraft((prev) =>
                        prev ? { ...prev, dayOfWeek: Number(v) } : prev,
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderedDays.map((d) => (
                        <SelectItem
                          key={d.day_of_week}
                          value={String(d.day_of_week)}
                        >
                          {d.day_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Start</Label>
                    <Input
                      type="time"
                      value={draft.start}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, start: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End</Label>
                    <Input
                      type="time"
                      value={draft.end}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, end: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Break start (optional)</Label>
                    <Input
                      type="time"
                      value={draft.breakStart}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, breakStart: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Break end (optional)</Label>
                    <Input
                      type="time"
                      value={draft.breakEnd}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, breakEnd: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Slot length (min)</Label>
                    <Input
                      type="number"
                      min={15}
                      max={120}
                      step={15}
                      value={draft.slot}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev
                            ? { ...prev, slot: Number(e.target.value) || 30 }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Capacity</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={draft.capacity}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev
                            ? {
                                ...prev,
                                capacity: Number(e.target.value) || 16,
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-row justify-between sm:justify-between">
                {isExistingBlock ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={clearDraftDay}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDraft(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={confirmDraft}>
                    {isExistingBlock ? "Save changes" : "Add block"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
