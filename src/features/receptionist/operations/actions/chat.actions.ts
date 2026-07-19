"use server";
import * as api from "../api/chat.api";
export async function fetchChatInbox() {
  return api.fetchChatInbox();
}
export async function fetchChatConversation(
  userId: number,
  patientId?: string,
) {
  return api.fetchChatConversation(userId, patientId);
}
export async function fetchPatientChatThreads() {
  return api.fetchPatientChatThreads();
}
export async function sendChatMessage(body: Record<string, unknown>) {
  return api.sendChatMessage(body);
}
export async function setChatTyping(typingToUserId: number) {
  return api.setChatTyping(typingToUserId);
}
export async function searchChatUsers(query = "") {
  return api.searchChatUsers(query);
}
export async function updatePresence(isOnline: boolean) {
  return api.updatePresence(isOnline);
}
