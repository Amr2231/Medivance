import type {
  ApiResponse,
  CallbackRequest,
  CommunicationEntry,
  ContactAttempt,
  PaginatedResponse,
} from "@/lib/types/receptionist-operations";
import { queryString, receptionBase, receptionFetch } from "./client";
export const fetchCallbacks = (
  params: Record<string, string | number | undefined> = {},
) =>
  receptionFetch<PaginatedResponse<CallbackRequest>>(
    `${receptionBase}/callbacks${queryString(params)}`,
  );
export const createCallback = (body: Record<string, unknown>) =>
  receptionFetch<ApiResponse<CallbackRequest>>(`${receptionBase}/callbacks`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateCallbackStatus = (id: number, status: string) =>
  receptionFetch<ApiResponse<CallbackRequest>>(
    `${receptionBase}/callbacks/${id}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
export const addContactAttempt = (id: number, body: Record<string, unknown>) =>
  receptionFetch<
    ApiResponse<{ attempt_id: number; callback: CallbackRequest }>
  >(`${receptionBase}/callbacks/${id}/attempts`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const fetchCommunicationTimeline = (
  nationalId: string,
  params: Record<string, string | number | undefined> = {},
) =>
  receptionFetch<
    ApiResponse<{
      communications: CommunicationEntry[];
      contact_attempts: ContactAttempt[];
      page: number;
      limit: number;
      total: number;
    }>
  >(
    `${receptionBase}/communications/${nationalId}/timeline${queryString(params)}`,
  );
export const addCommunicationNote = (body: Record<string, unknown>) =>
  receptionFetch<ApiResponse<{ communication_id: number }>>(
    `${receptionBase}/communications/notes`,
    { method: "POST", body: JSON.stringify(body) },
  );
