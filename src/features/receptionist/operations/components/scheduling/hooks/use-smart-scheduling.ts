"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateAppointment, useSuggestSlots } from "../../../hooks";

export function useSmartScheduling() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [nationalId, setNationalId] = useState("");
  const [duration, setDuration] = useState("30");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [lastBookedTime, setLastBookedTime] = useState<string | null>(null);
  const suggestSlots = useSuggestSlots();
  const createAppointment = useCreateAppointment();
  const bookingLocked = lastBookedTime !== null;

  const requestSuggestions = () => {
    if (!doctorId || !date || bookingLocked) return;
    setBookedTimes([]);
    setLastBookedTime(null);
    suggestSlots.mutate({
      doctor_id: Number(doctorId),
      date,
      national_id: nationalId || undefined,
      duration_minutes: Number(duration),
    });
  };

  const bookSlot = (appointmentTime: string) => {
    if (
      !nationalId ||
      nationalId.length !== 14 ||
      bookingLocked ||
      bookedTimes.includes(appointmentTime) ||
      createAppointment.isPending
    )
      return;
    createAppointment.mutate(
      {
        national_id: nationalId,
        doctor_id: Number(doctorId),
        appointment_date: date,
        appointment_time: appointmentTime,
        duration_minutes: Number(duration),
      },
      {
        onSuccess: (result) => {
          if (result && typeof result === "object" && "error" in result) {
            toast.error(
              (result as { message?: string }).message ??
                "Could not book this slot",
            );
            return;
          }
          setBookedTimes((times) => [...times, appointmentTime]);
          setLastBookedTime(appointmentTime);
          toast.success("Appointment booked successfully");
        },
        onError: () =>
          toast.error("Failed to book appointment. Please try again."),
      },
    );
  };

  const resetBooking = () => {
    setBookedTimes([]);
    setLastBookedTime(null);
    setNationalId("");
  };

  return {
    doctorId,
    setDoctorId,
    date,
    setDate,
    nationalId,
    setNationalId,
    duration,
    setDuration,
    bookedTimes,
    lastBookedTime,
    bookingLocked,
    scheduling: suggestSlots.data?.data,
    isSuggesting: suggestSlots.isPending,
    isBooking: createAppointment.isPending,
    requestSuggestions,
    bookSlot,
    resetBooking,
  };
}
