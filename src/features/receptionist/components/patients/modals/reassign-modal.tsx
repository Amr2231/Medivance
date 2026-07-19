"use client";

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
import { useDoctors } from "../../../hooks/use-doctors";
import { STUDY } from "@/lib/constants/study.constants";
import {
  reassignDoctorSchema,
  ReassignDoctorFields,
} from "@/lib/schemas/patient.schema";

export function ReassignModal({
  patient,
  onClose,
  onSave,
}: {
  patient: {
    national_id: string;
    first_name: string;
    last_name: string;
  } | null;
  onClose: () => void;
  onSave: (form: ReassignDoctorFields) => void;
}) {
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReassignDoctorFields>({
    resolver: zodResolver(reassignDoctorSchema),
    defaultValues: {
      doctor_id: undefined,
      study_type: undefined,
      study_date: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ReassignDoctorFields) => {
    onSave(data);
    handleClose();
  };

  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Reassign Doctor
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-800">
            Reassign {patient?.first_name} {patient?.last_name} to a new
            appointment
          </DialogDescription>
        </DialogHeader>

        {patient && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient Info */}
            <div className="rounded-lg border  bg-gray-900 p-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">First Name</p>
                <p className="text-sm font-medium">{patient.first_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Name</p>
                <p className="text-sm font-medium">{patient.last_name}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">National ID</p>
                <p className="text-sm font-medium font-mono">
                  {patient.national_id}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                {/* Doctor Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Assigned Doctor
                  </label>
                  <Controller
                    control={control}
                    name="doctor_id"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={doctorsLoading}
                      >
                        <SelectTrigger className="w-full py-5">
                          <SelectValue
                            placeholder={
                              doctorsLoading ? "Loading..." : "Select a doctor"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {doctors.map((d) => (
                            <SelectItem
                              key={d.user_id}
                              value={d.user_id.toString()}
                            >
                              {d.first_name} {d.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.doctor_id && (
                    <p className="text-xs text-red-500">
                      {errors.doctor_id.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Image Date
                </label>
                <Controller
                  control={control}
                  name="study_date"
                  render={({ field }) => (
                    <Input type="date" className="h-11 text-sm" {...field} />
                  )}
                />
                {errors.study_date && (
                  <p className="text-xs text-red-500">
                    {errors.study_date.message}
                  </p>
                )}
              </div>

              {/* Study Select */}
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Image
                </label>
                <Controller
                  control={control}
                  name="study_type"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full py-5">
                        <SelectValue placeholder="Select an image" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {STUDY.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.study_type && (
                  <p className="text-xs text-red-500">
                    {errors.study_type.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="default" type="submit">
                Reassign Patient
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
