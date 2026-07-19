import type {
  ApiResponse,
  Appointment,
  PaginatedResponse,
} from "@/lib/types/receptionist-operations";
import { queryString, receptionBase, receptionFetch } from "./client";

export const fetchTodayAppointments = (
  params: Record<string, string | number | undefined> = {},
) =>
  receptionFetch<PaginatedResponse<Appointment>>(
    `${receptionBase}/appointments/today${queryString(params)}`,
  );
export const fetchAppointment = (id: number) =>
  receptionFetch<ApiResponse<Appointment>>(
    `${receptionBase}/appointments/${id}`,
  );
export const fetchAppointmentTimeline = (id: number) =>
  receptionFetch<
    ApiResponse<{
      appointment: Appointment;
      timeline: {
        type: string;
        title: string;
        at: string;
        detail?: string;
        actor?: string;
      }[];
    }>
  >(`${receptionBase}/appointments/${id}/timeline`);
export const createAppointment = (body: Record<string, unknown>) =>
  receptionFetch<ApiResponse<Appointment>>(`${receptionBase}/appointments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateAppointmentStatus = (id: number, status: string) =>
  receptionFetch<ApiResponse<Appointment>>(
    `${receptionBase}/appointments/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
export const updateAppointmentPriority = (id: number, priority_level: string) =>
  receptionFetch<ApiResponse<Appointment>>(
    `${receptionBase}/appointments/${id}/priority`,
    { method: "PATCH", body: JSON.stringify({ priority_level }) },
  );
