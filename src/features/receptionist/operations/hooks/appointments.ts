"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  fetchAppointment,
  fetchAppointmentTimeline,
  fetchTodayAppointments,
  updateAppointmentPriority,
  updateAppointmentStatus,
} from "../actions/appointments.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useTodayAppointments(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointmentsToday(filters),
    queryFn: () => fetchTodayAppointments(filters),
    refetchInterval: 15_000,
    placeholderData: (previous) => previous,
    staleTime: 0,
  });
}
export function useAppointment(id: number) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointment(id),
    queryFn: () => fetchAppointment(id).then((response) => response.data),
    enabled: id > 0,
  });
}
export function useAppointmentTimeline(id: number) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointmentTimeline(id),
    queryFn: () =>
      fetchAppointmentTimeline(id).then((response) => response.data),
    enabled: id > 0,
  });
}
export function useUpdateAppointmentStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => client.invalidateQueries({ queryKey: ["reception"] }),
  });
}
export function useUpdateAppointmentPriority() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      priority_level,
    }: {
      id: number;
      priority_level: string;
    }) => updateAppointmentPriority(id, priority_level),
    onSuccess: () => client.invalidateQueries({ queryKey: ["reception"] }),
  });
}
export function useCreateAppointment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: (result) => {
      if (!(result && "error" in result && result.error))
        client.invalidateQueries({ queryKey: ["reception"] });
    },
  });
}
