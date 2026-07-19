"use server";
import * as api from "../api/scheduling.api";
export async function suggestSlots(body: Record<string, unknown>) {
  return api.suggestSlots(body);
}
export async function checkSchedulingConflict(body: Record<string, unknown>) {
  return api.checkSchedulingConflict(body);
}
