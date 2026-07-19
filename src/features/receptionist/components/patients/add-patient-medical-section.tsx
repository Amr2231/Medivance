"use client";

// Medical Assignment section (doctor + study type) of the add-patient form.
// Split out of add-patient-form.tsx (was 477 lines in one file).

import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import type { AddPatientFields } from "@/lib/schemas/patient.schema";
import { STUDY } from "@/lib/constants/study.constants";
import type { DoctorListItem } from "../../api/patients.api";
import { FieldLabel, FieldError } from "./add-patient-form-shared";

export function MedicalAssignmentSection({
  control,
  errors,
  doctors,
  loadingDoctors,
  setValue,
}: {
  control: Control<AddPatientFields>;
  errors: FieldErrors<AddPatientFields>;
  doctors: DoctorListItem[];
  loadingDoctors: boolean;
  setValue: UseFormSetValue<AddPatientFields>;
}) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-1.5 col-span-2">
        <FieldLabel label="Assigned Doctor" required />
        <Controller
          name="doctor_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(v) => {
                field.onChange(Number(v));
                setValue("appointment_time", "");
              }}
              disabled={loadingDoctors}
            >
              <SelectTrigger
                className={cn(
                  "h-9 text-sm w-full",
                  errors.doctor_id && "border-red-400",
                )}
              >
                <SelectValue
                  placeholder={
                    loadingDoctors ? "Loading..." : "Select a doctor"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.user_id} value={String(d.user_id)}>
                    {d.first_name} {d.last_name} ({d.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.doctor_id?.message} />
      </div>

      <div className="space-y-1.5 col-span-2">
        <FieldLabel label="Image Type" required />
        <Controller
          name="study_type"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                className={cn(
                  "h-10 text-sm w-full",
                  errors.study_type && "border-red-400",
                )}
              >
                <SelectValue placeholder="Select an image" />
              </SelectTrigger>
              <SelectContent>
                {STUDY.map((s) => (
                  <SelectItem key={s} value={s} className="text-sm">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.study_type?.message} />
      </div>
    </div>
  );
}
