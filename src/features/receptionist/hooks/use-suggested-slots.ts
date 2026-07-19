// use-suggested-slots.ts
import { useQuery } from "@tanstack/react-query";
import { getSuggestedSlotsAction } from "../actions/patients.actions";
import { normalizeAppointmentDate } from "../utils/appointment-date";

export { normalizeAppointmentDate } from "../utils/appointment-date";

export function useSuggestedSlots(params: {
  doctor_id: number;
  date: string;
  national_id?: string;
}) {
  const normalizedDate = normalizeAppointmentDate(params.date);

  return useQuery({
    queryKey: ["suggested-slots", params.doctor_id, normalizedDate, params.national_id],
    queryFn: () =>
      getSuggestedSlotsAction({
        doctor_id: params.doctor_id,
        date: normalizedDate,
        national_id: params.national_id,
        duration_minutes: 30,
      }),
    enabled: !!params.doctor_id && !!normalizedDate,
    staleTime: 2 * 60_000,
    placeholderData: (prev) => prev,
  });
}
