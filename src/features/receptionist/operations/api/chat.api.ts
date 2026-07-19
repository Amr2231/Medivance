import type {
  ChatInboxItem,
  ChatMessage,
  PatientChatThread,
} from "@/lib/types/receptionist-operations";
import { receptionBase, receptionFetch } from "./client";
export const fetchChatInbox = () =>
  receptionFetch<{ success: boolean; data: ChatInboxItem[] }>(
    "/api/chat/inbox",
  );
export const fetchChatConversation = (userId: number, patientId?: string) =>
  receptionFetch<{ success: boolean; data: ChatMessage[] }>(
    `/api/chat/${userId}${patientId ? `?patient_id=${patientId}` : ""}`,
  );
export const fetchPatientChatThreads = () =>
  receptionFetch<{ success: boolean; data: PatientChatThread[] }>(
    "/api/chat/patient-threads",
  );
export const sendChatMessage = (body: Record<string, unknown>) =>
  receptionFetch<{ success: boolean; message_id: number }>("/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const setChatTyping = (typingToUserId: number) =>
  receptionFetch<{ success: boolean }>("/api/chat/typing", {
    method: "POST",
    body: JSON.stringify({ typing_to_user_id: typingToUserId }),
  });
export const searchChatUsers = (query = "") =>
  receptionFetch<{
    success: boolean;
    data: {
      user_id: number;
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      role_name: string;
      is_online: number;
    }[];
  }>(
    `/api/chat/users${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`,
  );
export const updatePresence = (isOnline: boolean) =>
  receptionFetch<{ success: boolean }>(`${receptionBase}/presence`, {
    method: "PATCH",
    body: JSON.stringify({ is_online: isOnline }),
  });
