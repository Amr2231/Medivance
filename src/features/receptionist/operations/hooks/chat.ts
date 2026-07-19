"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchChatConversation,
  fetchChatInbox,
  fetchPatientChatThreads,
  sendChatMessage,
  setChatTyping,
} from "../actions/chat.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useChatInbox() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.chatInbox,
    queryFn: () => fetchChatInbox().then((response) => response.data),
    refetchInterval: 15_000,
  });
}
export function useChatConversation(userId: number, patientId?: string) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.chatConversation(userId, patientId),
    queryFn: () =>
      fetchChatConversation(userId, patientId).then(
        (response) => response.data,
      ),
    enabled: userId > 0,
    refetchInterval: 5_000,
  });
}
export function usePatientChatThreads() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.patientThreads,
    queryFn: () => fetchPatientChatThreads().then((response) => response.data),
    refetchInterval: 15_000,
  });
}
export function useSendChatMessage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["reception", "chat"] }),
  });
}
export function useChatTyping() {
  return useMutation({ mutationFn: setChatTyping });
}
