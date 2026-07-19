"use server";
import * as api from "../api/queue.api";
export async function fetchQueue(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchQueue(params);
}
export async function fetchArrivalBoard(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchArrivalBoard(params);
}
export async function callPatient(appointmentId: number) {
  return api.callPatient(appointmentId);
}
export async function fetchPriorityOverview() {
  return api.fetchPriorityOverview();
}
