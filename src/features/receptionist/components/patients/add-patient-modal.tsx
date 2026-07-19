"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Stethoscope, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";
import { addPatientSchema, type AddPatientFields } from "@/lib/schemas/patient.schema";
import { useAddPatient } from "../../hooks/use-add-patient";
import { useDoctors } from "../../hooks/use-doctors";
import { useSuggestedSlots } from "../../hooks/use-suggested-slots";
import { PersonalInfoSection } from "./add-patient-personal-section";
import { MedicalAssignmentSection } from "./add-patient-medical-section";
import { ScheduleSection } from "./add-patient-schedule-section";

const STEPS = [
  { label: "Patient details", icon: User, fields: ["first_name", "last_name", "national_id", "gender", "phone_number"] as const },
  { label: "Clinical assignment", icon: Stethoscope, fields: ["doctor_id", "study_type"] as const },
  { label: "Appointment", icon: Calendar, fields: ["study_date", "appointment_time"] as const },
];

export function AddPatientModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(0);
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const form = useForm<AddPatientFields>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: { first_name: "", last_name: "", national_id: "", gender: undefined, doctor_id: 0, phone_number: "", study_type: undefined, study_date: "", appointment_time: "" },
  });
  const { register, handleSubmit, control, watch, setValue, trigger, reset, formState: { errors } } = form;
  const nationalId = watch("national_id");
  const doctorId = watch("doctor_id");
  const studyDate = watch("study_date");
  const selectedTime = watch("appointment_time");
  const { data: slotsData, isFetching: loadingSlots } = useSuggestedSlots({ doctor_id: doctorId, date: studyDate, national_id: nationalId?.length === 14 ? nationalId : undefined });
  const { mutate: addPatient, isPending } = useAddPatient({
    onSuccess: () => {
      reset();
      setStep(0);
      onOpenChange(false);
    },
  });

  const close = (next: boolean) => {
    if (!next) {
      reset();
      setStep(0);
    }
    onOpenChange(next);
  };
  const next = async () => {
    if (await trigger(STEPS[step].fields)) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };
  const slots = slotsData?.data?.suggestions ?? [];
  const warnings = (slotsData?.data?.warnings ?? []) as Array<{ type: string; message: string }>;
  const Icon = STEPS[step].icon;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-y-auto p-0">
        <DialogHeader className="border-b border-gray-100 px-6 pb-4 pt-6 dark:border-gray-800">
          <DialogTitle className="text-base font-bold">Add new patient</DialogTitle>
          <p className="text-sm text-muted-foreground">Register the patient, assign the image, then reserve an available time.</p>
        </DialogHeader>
        <div className="flex items-start px-6 py-5">
          {STEPS.map((item, index) => {
            const StepIcon = item.icon;
            const done = index < step;
            const active = index === step;
            return <div key={item.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span className={cn("flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold", done && "border-emerald-700 bg-emerald-700 text-white", active && "border-emerald-700 text-emerald-700", !done && !active && "border-gray-200 text-gray-400 dark:border-gray-700")}>
                  {done ? <Check className="size-4" /> : <StepIcon className="size-4" />}
                </span>
                <span className={cn("whitespace-nowrap text-[11px] font-medium", active ? "text-emerald-700" : "text-gray-400")}>{item.label}</span>
              </div>
              {index < STEPS.length - 1 && <span className={cn("mx-3 mb-5 h-0.5 flex-1 rounded", done ? "bg-emerald-700" : "bg-gray-200 dark:bg-gray-800")} />}
            </div>;
          })}
        </div>
        <form onSubmit={handleSubmit((values) => addPatient(values))}>
          <div className="min-h-[280px] px-6 pb-5">
            <div className="mb-5 flex items-center gap-2">
              <Icon className="size-4 text-emerald-700" />
              <h3 className="text-sm font-semibold">{STEPS[step].label}</h3>
            </div>
            {step === 0 && <PersonalInfoSection register={register} control={control} errors={errors} nationalId={nationalId} />}
            {step === 1 && <MedicalAssignmentSection control={control} errors={errors} doctors={doctors} loadingDoctors={loadingDoctors} setValue={setValue} />}
            {step === 2 && <ScheduleSection register={register} control={control} errors={errors} setValue={setValue} doctorId={doctorId} studyDate={studyDate} selectedTime={selectedTime} slots={slots} warnings={warnings} loadingSlots={loadingSlots} />}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/30">
            <Button type="button" variant="ghost" onClick={step === 0 ? () => close(false) : () => setStep((current) => current - 1)} className="text-gray-500">
              {step === 0 ? "Cancel" : <><ChevronLeft className="size-4" /> Back</>}
            </Button>
            {step === STEPS.length - 1 ? (
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Add Patient"}</Button>
            ) : (
              <Button type="button" onClick={next}>Next step <ChevronRight className="size-4" /></Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
