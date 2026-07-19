"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  updatePatientSchema,
  type UpdatePatientFields,
} from "@/lib/schemas/patient.schema";
import type {
  ActivePatient,
  UpdatePatientPayload,
} from "@/lib/types/receptionist";
import { useDoctors } from "../../../hooks/use-doctors";
import { STUDY } from "@/lib/constants/study.constants";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

const toDateInput = (iso: string | undefined) => {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

export function EditPatientModal({
  patient,
  onClose,
  onSave,
  isPending,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
  onSave: (national_id: string, payload: UpdatePatientPayload) => void;
  isPending?: boolean;
}) {
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdatePatientFields>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
      gender: undefined,
      doctor_id: undefined,
      study_type: undefined,
      study_date: "",
    },
  });

  // populate form when patient changes
  useEffect(() => {
    if (patient) {
      reset({
        first_name: patient.first_name,
        last_name: patient.last_name,
        phone_number: patient.phone_number,
        national_id: patient.national_id,
        gender: patient.gender as "Male" | "Female",
        doctor_id: patient.doctor_id ?? undefined,
        study_type: patient.study_type as UpdatePatientFields["study_type"],
        study_date: toDateInput(patient.study_date),
      });
    }
  }, [patient, reset]);

  const onSubmit = (data: UpdatePatientFields) => {
    if (!patient) return;
    onSave(patient.national_id, data as UpdatePatientPayload);
  };

  if (!patient) return null;

  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Edit Patient
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Edit information for {patient.first_name} {patient.last_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* First Name */}
            <div>
              <p className="text-xs text-gray-400 mb-1">First Name</p>
              <Input
                {...register("first_name")}
                className={cn(errors.first_name && "border-red-400")}
              />
              <FieldError message={errors.first_name?.message} />
            </div>

            {/* Last Name */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Last Name</p>
              <Input
                {...register("last_name")}
                className={cn(errors.last_name && "border-red-400")}
              />
              <FieldError message={errors.last_name?.message} />
            </div>

            {/* National ID — it's the primary key */}
            <div>
              <p className="text-xs text-gray-400 mb-1">National ID</p>
              <Input
                {...register("national_id", {
                  onChange: (e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 14);
                  },
                })}
                placeholder="Enter National ID"
                className={cn(
                  "font-mono",
                  errors.national_id && "border-red-400",
                )}
              />

              <FieldError message={errors.national_id?.message} />
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone Number</p>
              <Input
                placeholder="01xxxxxxxxx"
                {...register("phone_number", {
                  onChange: (e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                  },
                })}
                className={cn(errors.phone_number && "border-red-400")}
              />
              <FieldError message={errors.phone_number?.message} />
            </div>

            {/* Gender */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Gender</p>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.gender && "border-red-400",
                      )}
                    >
                      {/* placeholder shows when no value selected */}
                      <SelectValue placeholder="Select gender" />
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

            {/* Doctor */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Doctor</p>
              <Controller
                name="doctor_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={doctorsLoading}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.doctor_id && "border-red-400",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          doctorsLoading ? "Loading..." : "Select a doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem
                          key={d.user_id}
                          value={d.user_id.toString()}
                        >
                          {d.first_name} {d.last_name} ({d.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.doctor_id?.message} />
            </div>

            {/* Study Type */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Image Type</p>
              <Controller
                name="study_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.study_type && "border-red-400",
                      )}
                    >
                      <SelectValue placeholder="Select image type" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDY.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.study_type?.message} />
            </div>

            {/* Study Date */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Image Date</p>
              <Input
                type="date"
                {...register("study_date")}
                className={cn(errors.study_date && "border-red-400")}
              />
              <FieldError message={errors.study_date?.message} />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
