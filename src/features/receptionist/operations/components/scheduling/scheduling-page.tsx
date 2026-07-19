"use client";

import { useDoctors } from "@/features/receptionist/hooks/use-doctors";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import { ReceptionLoadingState } from "../shared/ui";
import { SchedulingForm } from "./components/scheduling-form";
import { SchedulingResults } from "./components/scheduling-results";
import { useSmartScheduling } from "./hooks/use-smart-scheduling";

export function SchedulingPage() {
  const { data: doctors = [], isLoading } = useDoctors();
  const scheduling = useSmartScheduling();

  if (isLoading) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Smart Scheduling"
      description="Smart slot recommendations with conflict detection"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr]">
        <SchedulingForm
          doctors={doctors}
          doctorId={scheduling.doctorId}
          date={scheduling.date}
          nationalId={scheduling.nationalId}
          duration={scheduling.duration}
          bookingLocked={scheduling.bookingLocked}
          lastBookedTime={scheduling.lastBookedTime}
          isSuggesting={scheduling.isSuggesting}
          onDoctorChange={scheduling.setDoctorId}
          onDateChange={scheduling.setDate}
          onNationalIdChange={scheduling.setNationalId}
          onDurationChange={scheduling.setDuration}
          onSuggest={scheduling.requestSuggestions}
          onNewBooking={scheduling.resetBooking}
        />
        <SchedulingResults
          scheduling={scheduling.scheduling}
          nationalId={scheduling.nationalId}
          bookedTimes={scheduling.bookedTimes}
          bookingLocked={scheduling.bookingLocked}
          isBooking={scheduling.isBooking}
          onBook={scheduling.bookSlot}
        />
      </div>
    </ReceptionPageShell>
  );
}
