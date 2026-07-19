import type {
  ApiResponse,
  Appointment,
  SchedulingResult,
} from "@/lib/types/receptionist-operations";
import { receptionBase, receptionFetch } from "./client";
export const suggestSlots = (body: Record<string, unknown>) =>
  receptionFetch<ApiResponse<SchedulingResult>>(
    `${receptionBase}/scheduling/suggest`,
    { method: "POST", body: JSON.stringify(body) },
  );
export const checkSchedulingConflict = (body: Record<string, unknown>) =>
  receptionFetch<
    ApiResponse<{ has_conflict: boolean; conflicts: Appointment[] }>
  >(`${receptionBase}/scheduling/check-conflict`, {
    method: "POST",
    body: JSON.stringify(body),
  });
