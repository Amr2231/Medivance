"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorKeys } from "../constants/query-keys";
import {
  getChatInboxAction,
  getChatUnreadAction,
  getConversationAction,
  sendChatMessageAction,
} from "../actions/chat.actions";

export function useChatInbox() {
  return useQuery({
    queryKey: doctorKeys.chatInbox,
    queryFn: getChatInboxAction,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useChatUnread() {
  return useQuery({
    queryKey: doctorKeys.chatUnread,
    queryFn: getChatUnreadAction,
    refetchInterval: 15_000,
  });
}

export function useConversation(userId: number, page = 1) {
  return useQuery({
    queryKey: doctorKeys.chatConversation(userId, page),
    queryFn: () => getConversationAction(userId, page),
    refetchInterval: 5_000,
    enabled: userId > 0,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendChatMessageAction,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: doctorKeys.chatConversation(variables.receiver_id),
      });
      qc.invalidateQueries({ queryKey: doctorKeys.chatInbox });
      qc.invalidateQueries({ queryKey: doctorKeys.chatUnread });
    },
    onError: () => toast.error("Failed to send message"),
  });
}
