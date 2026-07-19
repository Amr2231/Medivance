"use server";
import * as api from "../api/appointments.api";
export async function fetchTodayAppointments(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchTodayAppointments(params);
}
export async function fetchAppointment(id: number) {
  return api.fetchAppointment(id);
}
export async function fetchAppointmentTimeline(id: number) {
  return api.fetchAppointmentTimeline(id);
}
export async function createAppointment(body: Record<string, unknown>) {
  try {
    return await api.createAppointment(body);
  } catch (error: unknown) {
    const failure = error as { status?: number; message?: string };
    return {
      success: false,
      status: failure.status || 500,
      message: failure.message || "Failed to create appointment",
    };
  }
}
export async function updateAppointmentStatus(id: number, status: string) {
  return api.updateAppointmentStatus(id, status);
}
export async function updateAppointmentPriority(
  id: number,
  priorityLevel: string,
) {
  return api.updateAppointmentPriority(id, priorityLevel);
}
