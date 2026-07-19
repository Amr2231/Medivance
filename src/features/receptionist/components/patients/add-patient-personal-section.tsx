"use client";

// Personal Information section of the add-patient form.
// Split out of add-patient-form.tsx (was 477 lines in one file).

import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import type { AddPatientFields } from "@/lib/schemas/patient.schema";
import { FieldLabel, FieldError } from "./add-patient-form-shared";

export function PersonalInfoSection({
  register,
  control,
  errors,
  nationalId,
}: {
  register: UseFormRegister<AddPatientFields>;
  control: Control<AddPatientFields>;
  errors: FieldErrors<AddPatientFields>;
  nationalId?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <FieldLabel label="First Name" required />
        <Input
          placeholder="e.g. Ahmed"
          {...register("first_name")}
          className={cn(
            "h-10  text-sm",
            errors.first_name && "border-red-400",
          )}
        />
        <FieldError message={errors.first_name?.message} />
      </div>

      <div className="space-y-1.5">
        <FieldLabel label="Last Name" required />
        <Input
          placeholder="e.g. Hassan"
          {...register("last_name")}
          className={cn("h-10  text-sm", errors.last_name && "border-red-400")}
        />
        <FieldError message={errors.last_name?.message} />
      </div>

      <div className="space-y-1.5 col-span-2">
        <FieldLabel label="National ID" required />
        <Input
          placeholder="14-digit National ID"
          {...register("national_id", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
          className={cn(
            "h-10  text-sm font-mono tracking-wider",
            errors.national_id && "border-red-400",
          )}
        />
        {errors.national_id ? (
          <FieldError message={errors.national_id.message} />
        ) : (
          <p className="text-xs text-gray-400">
            {(nationalId ?? "").length}/14 digits
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <FieldLabel label="Gender" required />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={cn(
                  "w-full h-10  text-sm",
                  errors.gender && "border-red-400",
                )}
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.gender?.message} />
      </div>

      <div className="space-y-1.5">
        <FieldLabel label="Phone Number" required />
        <Input
          placeholder="01xxxxxxxxx"
          {...register("phone_number", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
            },
          })}
          className={cn(
            "w-full h-10 px-3  text-sm",
            errors.phone_number && "border-red-400",
          )}
        />
        <FieldError message={errors.phone_number?.message} />
      </div>
    </div>
  );
}
