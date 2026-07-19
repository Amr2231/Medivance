"use server";
import * as api from "../api/communications.api";
export async function fetchCallbacks(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchCallbacks(params);
}
export async function createCallback(body: Record<string, unknown>) {
  return api.createCallback(body);
}
export async function updateCallbackStatus(id: number, status: string) {
  return api.updateCallbackStatus(id, status);
}
export async function addContactAttempt(
  id: number,
  body: Record<string, unknown>,
) {
  return api.addContactAttempt(id, body);
}
export async function fetchCommunicationTimeline(
  nationalId: string,
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchCommunicationTimeline(nationalId, params);
}
export async function addCommunicationNote(body: Record<string, unknown>) {
  return api.addCommunicationNote(body);
}
