import { serverFetch } from "@/lib/shared/api/server-client";
import type { ChatInboxItem, ChatMessage } from "@/lib/types/doctor-portal";
import type { MutationResponse } from "@/lib/types/doctor";

// fetch chat inbox
export async function fetchChatInbox(): Promise<{
  success: boolean;
  data: ChatInboxItem[];
}> {
  return serverFetch("/api/chat/inbox");
}

// fetch chat unread
export async function fetchChatUnread(): Promise<{
  success: boolean;
  unread: number;
}> {
  return serverFetch("/api/chat/unread");
}

// fetch conversation
export async function fetchConversation(
  userId: number,
  page = 1,
): Promise<{
  success: boolean;
  page: number;
  limit: number;
  data: ChatMessage[];
}> {
  return serverFetch(`/api/chat/${userId}?page=${page}&limit=30`);
}

// search chat users
export async function searchChatUsers(query = ""): Promise<{
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
}> {
  const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  return serverFetch(`/api/chat/users${qs}`);
}

// send chat message
export async function sendChatMessage(payload: {
  receiver_id: number;
  message: string;
}): Promise<MutationResponse & { message_id?: number }> {
  return serverFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
