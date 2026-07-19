"use client";

// Date & Appointment Time section (with suggested-slot picker) of the
// add-patient form. Split out of add-patient-form.tsx (was 477 lines in one file).

import type { Control, UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { PulseLoader } from "@/components/ui/pulse-loader";
import type { AddPatientFields } from "@/lib/schemas/patient.schema";
import { FieldLabel, FieldError } from "./add-patient-form-shared";

type Slot = { appointment_time: string; score?: number };
type Warning = { type: string; message: string };

export function ScheduleSection({
  register,
  control,
  errors,
  setValue,
  doctorId,
  studyDate,
  selectedTime,
  slots,
  warnings,
  loadingSlots,
}: {
  register: UseFormRegister<AddPatientFields>;
  control: Control<AddPatientFields>;
  errors: FieldErrors<AddPatientFields>;
  setValue: UseFormSetValue<AddPatientFields>;
  doctorId: number;
  studyDate?: string;
  selectedTime?: string;
  slots: Slot[];
  warnings: Warning[];
  loadingSlots: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <FieldLabel label="Image Date" required />
        <Input
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          {...register("study_date", {
            onChange: () => setValue("appointment_time", ""),
          })}
          className={cn("h-10  text-sm", errors.study_date && "border-red-400")}
        />
        <FieldError message={errors.study_date?.message} />
      </div>

      {/* Slots */}
      {doctorId > 0 && studyDate && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <FieldLabel label="Available Time Slots" required />
            {loadingSlots && <PulseLoader />}
          </div>

          {/* Warnings */}
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
              {w.message}
            </div>
          ))}

          {!loadingSlots && slots.length === 0 && !warnings.length && (
            <p className="text-xs text-muted-foreground py-2">
              No available slots for this date.
            </p>
          )}

          {slots.length > 0 && (
            <Controller
              name="appointment_time"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const time = String(slot.appointment_time).slice(0, 5);
                    const isSelected = field.value === slot.appointment_time;
                    return (
                      <button
                        key={slot.appointment_time}
                        type="button"
                        onClick={() => field.onChange(slot.appointment_time)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all",
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                            : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40",
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={cn(
                              "font-mono text-sm font-semibold",
                              isSelected ? "text-emerald-700" : "text-gray-800",
                            )}
                          >
                            {time}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px]",
                            isSelected ? "text-emerald-600" : "text-gray-400",
                          )}
                        >
                          Score: {slot.score}/100
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          )}
          <FieldError message={errors.appointment_time?.message} />
        </div>
      )}

      {/* Selected time summary */}
      {selectedTime && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700">
            Appointment at{" "}
            <span className="font-mono font-semibold">
              {String(selectedTime).slice(0, 5)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
