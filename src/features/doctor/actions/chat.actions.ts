"use server";

import * as chatApi from "../api/chat.api";

// get chat inbox
export async function getChatInboxAction() {
  return chatApi.fetchChatInbox();
}

// get chat unread
export async function getChatUnreadAction() {
  return chatApi.fetchChatUnread();
}

// get conversation
export async function getConversationAction(userId: number, page = 1) {
  return chatApi.fetchConversation(userId, page);
}

// search chat users
export async function searchChatUsersAction(query = "") {
  return chatApi.searchChatUsers(query);
}

// send chat message
export async function sendChatMessageAction(payload: {
  receiver_id: number;
  message: string;
}) {
  return chatApi.sendChatMessage(payload);
}
