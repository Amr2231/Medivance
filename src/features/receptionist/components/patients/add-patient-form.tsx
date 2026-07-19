"use client";

// Add-patient page. Composition only — each section lives in its own file:
//   add-patient-form-shared.tsx     -> SectionCard / FieldLabel / FieldError
//   add-patient-personal-section.tsx -> name / national id / gender / phone
//   add-patient-medical-section.tsx  -> doctor / study type
//   add-patient-schedule-section.tsx -> study date / suggested slots

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Calendar } from "lucide-react";
import { useAddPatient } from "../../hooks/use-add-patient";
import { useDoctors } from "../../hooks/use-doctors";
import { useSuggestedSlots } from "../../hooks/use-suggested-slots";
import {
  addPatientSchema,
  type AddPatientFields,
} from "@/lib/schemas/patient.schema";
import { OperationalPageShell as ReceptionPageShell } from "@/components/shared/operational-page-shell";
import { SectionCard } from "./add-patient-form-shared";
import { PersonalInfoSection } from "./add-patient-personal-section";
import { MedicalAssignmentSection } from "./add-patient-medical-section";
import { ScheduleSection } from "./add-patient-schedule-section";

export function AddPatientForm() {
  const { mutate: addPatient, isPending } = useAddPatient();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddPatientFields>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      gender: undefined,
      doctor_id: 0,
      phone_number: "",
      study_type: undefined,
      study_date: "",
      appointment_time: "",
    },
  });

  const nationalId = watch("national_id");
  const doctorId = watch("doctor_id");
  const studyDate = watch("study_date");
  const selectedTime = watch("appointment_time");

  const { data: slotsData, isFetching: loadingSlots } = useSuggestedSlots({
    doctor_id: doctorId,
    date: studyDate,
    national_id: nationalId?.length === 14 ? nationalId : undefined,
  });

  const slots = slotsData?.data?.suggestions ?? [];
  const warnings = (slotsData?.data?.warnings ?? []) as Array<{
    type: string;
    message: string;
  }>;

  const onSubmit = (data: AddPatientFields) => {
    addPatient(data);
  };

  return (
    <ReceptionPageShell
      title="Add New Patient"
      description="Register a new patient in the system."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Personal Info ── */}
        <SectionCard
          icon={User}
          title="Personal Information"
          description="Enter the patient's basic details"
          index={0}
        >
          <PersonalInfoSection
            register={register}
            control={control}
            errors={errors}
            nationalId={nationalId}
          />
        </SectionCard>

        {/* ── Medical Assignment ── */}
        <SectionCard
          icon={Stethoscope}
          title="Medical Assignment"
          description="Assign the patient to a doctor"
          index={1}
        >
          <MedicalAssignmentSection
            control={control}
            errors={errors}
            doctors={doctors}
            loadingDoctors={loadingDoctors}
            setValue={setValue}
          />
        </SectionCard>

        {/* ── Dates & Time ── */}
        <SectionCard
          icon={Calendar}
          title="Date & Appointment Time"
          description="Set image date and pick an available slot"
          index={2}
        >
          <ScheduleSection
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            doctorId={doctorId}
            studyDate={studyDate}
            selectedTime={selectedTime}
            slots={slots}
            warnings={warnings}
            loadingSlots={loadingSlots}
          />
        </SectionCard>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex justify-end pb-4"
        >
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Add Patient"}
          </Button>
        </motion.div>
      </form>
    </ReceptionPageShell>
  );
}
