import type {
  ApiResponse,
  Appointment,
  ArrivalBoardEntry,
  PaginatedResponse,
  QueueEntry,
} from "@/lib/types/receptionist-operations";
import { queryString, receptionBase, receptionFetch } from "./client";
export const fetchQueue = (
  params: Record<string, string | number | undefined> = {},
) =>
  receptionFetch<PaginatedResponse<QueueEntry>>(
    `${receptionBase}/queue${queryString(params)}`,
  );
export const fetchArrivalBoard = (
  params: Record<string, string | number | undefined> = {},
) =>
  receptionFetch<ApiResponse<ArrivalBoardEntry[]>>(
    `${receptionBase}/arrival-board${queryString(params)}`,
  );
export const callPatient = (appointmentId: number) =>
  receptionFetch<ApiResponse<Appointment>>(
    `${receptionBase}/arrival-board/${appointmentId}/call`,
    { method: "POST" },
  );
export const fetchPriorityOverview = () =>
  receptionFetch<ApiResponse<QueueEntry[]>>(
    `${receptionBase}/priority-overview`,
  );
